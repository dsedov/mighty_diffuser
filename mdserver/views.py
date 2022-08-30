from django.shortcuts import render
from django.views.decorators.cache import never_cache
from django.http import HttpResponse
from django.http import FileResponse
from PIL import Image 
from .stable import generate, config, load_model

cfg = config()
cfg.config = "C:/Users/dsedov/sd/dev/mighty_diffuser/stable-diffusion/configs/stable-diffusion/v1-inference.yaml"
cfg.ckpt = "C:/Users/dsedov/sd/dev/models/ldm/stable-diffusion-v1/model.ckpt"
global_model = load_model(cfg.config, cfg.ckpt)
# Create your views here.
def sanitize_file_name(name):
    return name.replace(',','_').lower()

@never_cache
def prompt(request):
    prompt_value = request.GET['q']
    try:
        if 'scale' in request.GET.keys():
            cfg.scale = int(request.GET['scale'])
        if 'w' in request.GET.keys():
            cfg.w = int(request.GET['w'])
        if 'h' in request.GET.keys():
            cfg.w = int(request.GET['h'])
        if 'steps' in request.GET.keys():
            cfg.ddim_steps = int(request.GET['steps'])
    except:
        print("ERROR")
  
    cfg.seed = 0
    images = generate(cfg, f"{prompt_value}", global_model) 

    img = images[0]
    response = HttpResponse(content_type='image/jpg')
    img.save(response, "JPEG")
    response["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response['Content-Disposition'] = f"attachment; filename=\"{sanitize_file_name(prompt_value)}.jpg\""
    return response