from django.shortcuts import render
from xmlrpc.client import Boolean
from django.shortcuts import render
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.http import FileResponse
from django.apps import apps
import random
import uuid, yaml
from PIL import Image 
from .stable import generate, config, load_model, prepare_mask
import json
import queue
import threading
from PIL import Image
# Create your views here.
import re
def sanitize_file_name(name):
    name = re.sub(r'[^a-z_A-Z0-9]', '', name.replace(' ', '_'))
    return name.lower()

@csrf_exempt
def txt2img(request):
    appConfig = apps.get_app_config('mdnode')
    
    new_config = config()
    new_config.config = appConfig.server_config["stable_diffusion"]["config"]
    new_config.ckpt = appConfig.server_config["stable_diffusion"]["checkpoint"]
    new_config.safety_filter = True
    new_config.seed = random.randint(0, 2**32)

    data = json.loads(request.body)

    prompt_value = data['prompt']
    if isinstance(prompt_value, list):
        file_name = prompt_value[0]["text"]
    else:
        file_name = prompt_value
    print(type(prompt_value))
    print(prompt_value)
    try:
        if 'scale' in data.keys():
            new_config.scale = float(data['scale'])
        if 'width' in data.keys():
            new_config.W = int(data['width']) // 2
        if 'height' in data.keys():
            new_config.H = int(data['height']) // 2
        if 'steps' in data.keys():
            new_config.ddim_steps = int(data['steps'])
        if 'seed' in data.keys():
            new_config.seed = int(data['seed'])
        if 'safety' in data.keys():
            new_config.safety_filter = Boolean(data['safety'])

    except:
        print("ERROR")
  
    images = generate(  new_config, 
                        prompt_value, 
                        appConfig.model,
                        device='cuda' if appConfig.server_config["stable_diffusion"]['device'] == 'cuda' else 'cpu') 

    img = images[0]
    response = HttpResponse(content_type='image/png')
    
    response["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response['filename'] = f"{sanitize_file_name(file_name)}__{new_config.seed}.png"

    img.save(response, "PNG")
    return response
import os
@csrf_exempt
def img2img(request):
    appConfig = apps.get_app_config('mdnode')
    new_config = config()
    new_config.plms = False
    new_config.config = appConfig.server_config["stable_diffusion"]["config"]
    new_config.ckpt = appConfig.server_config["stable_diffusion"]["checkpoint"]
    new_config.safety_filter = True
    new_config.seed = random.randint(0, 2**32)
    new_config.init_img_strength = 0.5

    if request.method == 'POST' and request.FILES['image']:
        img = Image.open(request.FILES['image'])
        if 'mask' in request.FILES.keys():
            img_mask = Image.open(request.FILES['mask'])
            new_config.init_img_mask_data = img_mask
        new_config.init_img_data = img
        print(request.POST.keys())
        prompt_value = request.POST['prompt']
        try:
            if 'scale' in request.POST.keys():
                new_config.scale = float(request.POST['scale'])
            if 'width' in request.POST.keys():
                new_config.W = int(request.POST['width']) 
            if 'height' in request.POST.keys():
                new_config.H = int(request.POST['height']) 
            if 'steps' in request.POST.keys():
                new_config.ddim_steps = int(request.POST['steps'])
            if 'seed' in request.POST.keys():
                new_config.seed = int(request.POST['seed'])
            if 'safety' in request.POST.keys():
                new_config.safety_filter = Boolean(request.POST['safety'])
            if 'init_strength' in request.POST.keys():
                new_config.init_img_strength = 1.0 - float(request.POST['init_strength'])

        except:
            print("ERROR")

        images = generate(new_config, f"{prompt_value}", appConfig.model) 

        img = images[0]
        response = HttpResponse(content_type='image/png')
        response['filename'] = f"{sanitize_file_name(prompt_value)}__{new_config.seed}.png"

        img.save(response, "PNG")
        return response
    
    response_data = {}
    response_data['result'] = 'ERR'
    response_data['message'] = "No image attached"
    return HttpResponse(json.dumps(response_data), content_type="application/json")