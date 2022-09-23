from xmlrpc.client import Boolean
from django.shortcuts import render
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.http import FileResponse
import random
import uuid, yaml
from PIL import Image 

import json
import queue
import threading
from PIL import Image


# Create your views here.
import re
def sanitize_file_name(name):
    name = re.sub(r'[^a-z_A-Z0-9]', '', name.replace(' ', '_'))
    return name.lower()
def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

@never_cache
@csrf_exempt
def register_node(request):
    data = json.loads(request.body)
    print(f"Node request: {get_client_ip(request)}")
    response_data = {}
    response_data['result'] = 'OK'
    return HttpResponse(json.dumps(response_data), content_type="application/json")

@never_cache
@csrf_exempt
def ping(request):
    data = json.loads(request.body)

    response_data = {}
    response_data['result'] = 'OK'
    return HttpResponse(json.dumps(response_data), content_type="application/json")



@never_cache
@csrf_exempt
def submit_prompt(request):
    new_config = config()
    new_config.config = cfg.config
    new_config.ckpt = cfg.ckpt
    new_config.safety_filter = True
    new_config.seed = random.randint(0, 2**32)

    prompt_value = request.GET['q']
    try:
        if 'scale' in request.GET.keys():
            new_config.scale = int(request.GET['scale'])
        if 'w' in request.GET.keys():
            new_config.W = int(request.GET['w']) // 2
        if 'h' in request.GET.keys():
            new_config.H = int(request.GET['h']) // 2
        if 'steps' in request.GET.keys():
            new_config.ddim_steps = int(request.GET['steps'])
        if 'samples' in request.GET.keys():
            new_config.n_samples = int(request.GET['samples'])
        if 'seed' in request.GET.keys():
            new_config.seed = int(request.GET['seed'])
        if 'seed' in request.POST.keys():
            new_config.seed = int(request.POST['seed'])
    except:
        print("ERROR")


    new_render_item = RenderQueueItem(prompt_value, new_config)
    global_queue.post_job(new_render_item)

    response_data = {}
    response_data['result'] = 'OK'
    response_data['seed'] = new_config.seed
    response_data['id'] = str(new_render_item.id)
    return HttpResponse(json.dumps(response_data), content_type="application/json")

@never_cache
@csrf_exempt
def check_prompt(request):
    id_value = request.GET['id']
    job = global_queue.get_job(id_value)
    response_data = {}
    if job is not None:
        response_data['result'] = 'OK'
        response_data['samples'] = len(job.images)

    else:
        response_data['result'] = 'WAITING'
    return HttpResponse(json.dumps(response_data), content_type="application/json")

@never_cache
@csrf_exempt
def download_prompt(request):
    id_value = request.GET['id']
    job = global_queue.get_job(id_value)

    response = HttpResponse(content_type='image/png')   
    response['Content-Disposition'] = f"attachment; filename=\"{sanitize_file_name(job.prompt)}_{job.settings.seed}.png\""
    job.images[0].save(response, "PNG")
    return response

from pathlib import Path
@csrf_exempt
def save_prompt(request):
    data = json.loads(request.body)
    id_value = data['id']
    job = global_queue.get_job(id_value)
    
    root_folder = f'F:/All_Projects/render_library/12_AI/saved/{get_client_ip(request)}/'
    Path(root_folder).mkdir(parents=True, exist_ok=True)    
    job.images[0].save(f'{root_folder}{id_value}.png')
    with open(f"{root_folder}{id_value}.json", 'w') as f:
        f.writelines(json.dumps({
            "prompt" : job.prompt,
            "seed" : job.settings.seed,
            "settings" : {
                "width" : job.settings.W,
                "height": job.settings.H,
                "steps" : job.settings.ddim_steps,
                "scale" : job.settings.scale,
            }
        }))

    response_data = {}
    response_data['result'] = 'OK'

    return HttpResponse(json.dumps(response_data), content_type="application/json")


