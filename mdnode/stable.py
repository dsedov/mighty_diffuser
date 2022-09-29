import argparse, os, sys, glob
import torch
import numpy as np
import random 
from omegaconf import OmegaConf
from PIL import Image, ImageDraw, ImageFilter
from tqdm import tqdm, trange
from itertools import islice
from einops import rearrange, repeat
from torchvision.utils import make_grid
import torchvision.transforms.functional as TF
import time
from pytorch_lightning import seed_everything
from torch import autocast
from contextlib import contextmanager, nullcontext
import PIL, os

sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))),'stable-diffusion'))

from ldm.util import instantiate_from_config
from ldm.models.diffusion.ddim import DDIMSampler
from ldm.models.diffusion.plms import PLMSSampler

from kdiffusion.external import CompVisDenoiser

from diffusers.pipelines.stable_diffusion.safety_checker import StableDiffusionSafetyChecker
from transformers import AutoFeatureExtractor

# load safety model
safety_model_id = "CompVis/stable-diffusion-safety-checker"
safety_feature_extractor = AutoFeatureExtractor.from_pretrained(safety_model_id)
safety_checker = StableDiffusionSafetyChecker.from_pretrained(safety_model_id)

def chunk(it, size):
    it = iter(it)
    return iter(lambda: tuple(islice(it, size)), ())

def load_model_from_config(config, ckpt, verbose=False, gpu=True):
    print(f"Loading model from {ckpt}")
    pl_sd = torch.load(ckpt, map_location="cpu")
    if "global_step" in pl_sd:
        print(f"Global Step: {pl_sd['global_step']}")
    sd = pl_sd["state_dict"]
    model = instantiate_from_config(config.model)
    m, u = model.load_state_dict(sd, strict=False)
    if len(m) > 0 and verbose:
        print("missing keys:")
        print(m)
    if len(u) > 0 and verbose:
        print("unexpected keys:")
        print(u)

    if gpu:
        model.cuda()
    else:
        model.cpu()
    model.eval()
    return model

def load_img(opt):
    if opt.init_img_data == None:
        image = Image.open(opt.init_img).convert("RGB").resize((opt.W,opt.H), resample=PIL.Image.LANCZOS)
    else:
        image = opt.init_img_data.convert("RGB").resize((opt.W,opt.H), resample=PIL.Image.LANCZOS)
    w, h = image.size
    print(f"loaded input image of size ({w}, {h}) from {opt.init_img}")
    w, h = map(lambda x: x - x % 32, (w, h))  # resize to integer multiple of 32
    image = image.resize((w, h), resample=PIL.Image.LANCZOS)
    image = np.array(image).astype(np.float32) / 255.0
    image = image[None].transpose(0, 3, 1, 2)
    image = torch.from_numpy(image)
    return 2.*image - 1.

class config():
      def __init__(self):
        self.safety_filter = True
        #self.outdir = 'C:/Users/dsedov/sd/output'
        self.ddim_steps = 20
        self.plms = True
        self.laion400m = False
        self.seed = 0
        self.config = 'configs/stable-diffusion/v1-inference.yaml'
        self.ckpt = 'models/ldm/stable-diffusion-v1/model.ckpt'
        self.precision = 'autocast'
        self.n_rows = 0
        self.fixed_code = True
        self.from_file = False
        self.C = 4
        self.H = 256
        self.W = 256
        self.f = 4
        self.n_samples = 1
        self.n_iter = 1
        self.scale = 7.5
        self.ddim_eta = 0.0
        self.skip_save = False
        self.skip_grid = False
        self.init_img = None
        self.init_img_data = None
        self.init_img_mask_data = None
        self.init_img_strength = 0.0

def load_model(config_path, checkpoint_path, gpu=True):
    config = OmegaConf.load(config_path)
    model = load_model_from_config(config, checkpoint_path, gpu=gpu)
    if gpu: model = model.half()
    return model
def load_replacement(x):
    print("Replacing image with safety")
    try:
        hwc = x.shape
        y = Image.open("assets/rick.jpeg").convert("RGB").resize((hwc[1], hwc[0]))
        y = (np.array(y)/255.0).astype(x.dtype)
        assert y.shape == x.shape
        return y
    except Exception:
        y = Image.new('RGB', (hwc[1], hwc[0]), color = (255,255,255))
        y = (np.array(y)/255.0).astype(x.dtype)
        return y
def numpy_to_pil(images):
    """
    Convert a numpy image or a batch of images to a PIL image.
    """
    if images.ndim == 3:
        images = images[None, ...]
    images = (images * 255).round().astype("uint8")
    pil_images = [Image.fromarray(image) for image in images]

    return pil_images
def load_mask_img(path, shape):
    # path (str): Path to the mask image
    # shape (list-like len(4)): shape of the image to match, usually latent_image.shape
    mask_w_h = (shape[-1], shape[-2])
    if path.startswith('http://') or path.startswith('https://'):
        mask_image = Image.open(requests.get(path, stream=True).raw).convert('RGBA')
    else:
        mask_image = Image.open(path).convert('RGBA')
    mask = mask_image.resize(mask_w_h, resample=Image.LANCZOS)
    mask = mask.convert("L")
    return mask

def prepare_mask(mask, mask_brightness_adjust=1.0, mask_contrast_adjust=1.0, invert=False):

    # Mask brightness/contrast adjustments
    if mask_brightness_adjust != 1:
        mask = TF.adjust_brightness(mask, mask_brightness_adjust)
    if mask_contrast_adjust != 1:
        mask = TF.adjust_contrast(mask, mask_contrast_adjust)

    # Mask image to array
    mask = np.array(mask).astype(np.float32) / 255.0
    mask = np.tile(mask,(4,1,1))
    mask = np.expand_dims(mask,axis=0)
    mask = torch.from_numpy(mask)

    if invert:
        mask = ( (mask - 0.5) * -1) + 0.5
    
    mask = np.clip(mask,0,1)
    return mask
    
def make_callback(mask=None, init_latent=None, sigmas=None, sampler=None, device = "cuda", masked_noise_modifier=1.0):
    def img_callback(img, i):
        if mask is not None:
            i_inv = len(sigmas) - i - 1
            init_noise = sampler.stochastic_encode(init_latent, torch.tensor([i_inv]*1).to(device), noise=noise)
            is_masked = torch.logical_and(mask >= mask_schedule[i], mask != 0 )
            new_img = init_noise * torch.where(is_masked,1,0) + img * torch.where(is_masked,0,1)
            img.copy_(new_img)
    if init_latent is not None:
        noise = torch.randn_like(init_latent, device=device) * masked_noise_modifier
    if sigmas is not None and len(sigmas) > 0:
        mask_schedule, _ = torch.sort(sigmas/torch.max(sigmas))
    elif len(sigmas) == 0:
        mask = None # no mask needed if no steps (usually happens because strength==1.0)

    # Callback function formated for compvis latent diffusion samplers
    if mask is not None:
        assert sampler is not None, "Callback function for stable-diffusion samplers requires sampler variable"
        batch_size = init_latent.shape[0]

        callback = img_callback
    return img_callback

def check_safety(x_image):

    print("Checking for safety")
    safety_checker_input = safety_feature_extractor(numpy_to_pil(x_image), return_tensors="pt")
    x_checked_image, has_nsfw_concept = safety_checker(images=x_image, clip_input=safety_checker_input.pixel_values)
    assert x_checked_image.shape[0] == len(has_nsfw_concept)
    for i in range(len(has_nsfw_concept)):
        if has_nsfw_concept[i]:
            print("Found non safe image")
            x_checked_image[i] = load_replacement(x_checked_image[i])
    return x_checked_image, has_nsfw_concept
def generate(opt, prompt, model, device='cuda'):
    if opt.plms:
        sampler = PLMSSampler(model)
    else:
        sampler = DDIMSampler(model)
    images = []
    model_wrap = CompVisDenoiser(model) 

    if opt.seed > 0 : seed_everything(opt.seed)
    else :
        opt.seed = random.randint(0, 2**32)
        seed_everything(opt.seed)

    if opt.init_img != None or opt.init_img_data != None:
        if opt.init_img_data == None: 
            assert os.path.isfile(opt.init_img)
        if opt.init_img_mask_data != None:
            prepared_mask = prepare_mask(opt.init_img_mask_data)
        else: 
            prepared_mask = None
        
        init_image = load_img(opt).to(device)
        init_image = init_image.half()
        init_image = repeat(init_image, '1 ... -> b ...', b=1)
        init_latent = model.get_first_stage_encoding(model.encode_first_stage(init_image))  # move to latent space

        sampler.make_schedule(ddim_num_steps=opt.ddim_steps, ddim_eta=opt.ddim_eta, verbose=False)

        assert 0. <= opt.init_img_strength <= 1., 'can only work with strength in [0.0, 1.0]'
        t_enc = int(opt.init_img_strength * opt.ddim_steps)
        # Noise schedule for the k-diffusion samplers (used for masking)
        k_sigmas = model_wrap.get_sigmas(opt.ddim_steps)
        k_sigmas = k_sigmas[len(k_sigmas)-t_enc-1:]
        callback = make_callback(
                            mask=prepared_mask, 
                            init_latent=init_latent,
                            sigmas=k_sigmas,
                            sampler=sampler)

        print(f"target t_enc is {t_enc} steps")
    else:
        start_code = None
        if opt.fixed_code:
            start_code = torch.randn([opt.n_samples, opt.C, opt.H // opt.f, opt.W // opt.f], device=device)

    precision_scope = autocast if opt.precision=="autocast" else nullcontext
    with torch.no_grad():
        with precision_scope(device):
            with model.ema_scope():
                #tic = time.time()
                all_samples = list()
                uc = None
                if opt.scale != 1.0:
                    uc = model.get_learned_conditioning(1 * [""])

                if isinstance(prompt, list):
                    print("Weighted prompt")
                    ckl = []
                    for p in prompt:
                        ck = model.get_learned_conditioning(p["text"]) * p["weight"]
                        ckl.append(ck)
                    c = sum(ckl)

                else:   
                    print("Single prompt") 
                    c = model.get_learned_conditioning(prompt)

                if opt.init_img != None or opt.init_img_data != None:
                    # encode (scaled latent)
                    z_enc = sampler.stochastic_encode(init_latent, torch.tensor([t_enc]).to(device))
                    # decode it
                    samples = sampler.decode(z_enc, 
                                            c, 
                                            t_enc, 
                                            unconditional_guidance_scale=opt.scale, 
                                            unconditional_conditioning=uc,
                                            img_callback=callback)
                else:
                    shape = [opt.C, opt.H // opt.f, opt.W // opt.f]
                    samples, _ = sampler.sample(S=opt.ddim_steps,
                                                    conditioning=c,
                                                    batch_size=1,
                                                    shape=shape,
                                                    verbose=False,
                                                    unconditional_guidance_scale=opt.scale,
                                                    unconditional_conditioning=uc,
                                                    eta=opt.ddim_eta,
                                                    x_T=start_code)

                if opt.safety_filter:
                    x_samples_ddim = model.decode_first_stage(samples)
                    x_samples_ddim = torch.clamp((x_samples_ddim + 1.0) / 2.0, min=0.0, max=1.0)
                    x_samples_ddim = x_samples_ddim.cpu().permute(0, 2, 3, 1).numpy()
                    x_checked_image, has_nsfw_concept = check_safety(x_samples_ddim)
                    x_samples = torch.from_numpy(x_checked_image).permute(0, 3, 1, 2)
                else:
                    x_samples = model.decode_first_stage(samples)
                    x_samples = torch.clamp((x_samples + 1.0) / 2.0, min=0.0, max=1.0)

                
                for x_sample in x_samples:
                    x_sample = 255. * rearrange(x_sample.cpu().numpy(), 'c h w -> h w c')
                    images +=[Image.fromarray(x_sample.astype(np.uint8))]


                return images