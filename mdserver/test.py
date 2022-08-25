from stable import generate, config, load_model

model_folder = ""

cfg = config()
cfg.config = "C:/Users/dsedov/sd/dev/mighty_diffuser/stable-diffusion/configs/stable-diffusion/v1-inference.yaml"
cfg.ckpt = "C:/Users/dsedov/sd/dev/models/ldm/stable-diffusion-v1/model.ckpt"
model = load_model(cfg.config, cfg.ckpt)

images = generate(cfg, "some cool image", model) 

