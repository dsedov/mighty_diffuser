from xmlrpc.client import Boolean
from django.shortcuts import render
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseBadRequest
from django.http import FileResponse
from django.apps import apps
from .models import Node, Prompt, User, File
import random, pytz
from datetime import datetime, timedelta
import uuid, yaml
from PIL import Image 
from mdnode.stable import config
import json, os
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
def bad_request(message):
    response_data = {}
    response_data['result'] = 'ERR'
    response_data['message'] = message
    return HttpResponseBadRequest(json.dumps(response_data), content_type="application/json")
def ok_reply(message=''):
    response_data = {}
    response_data['result'] = 'OK'
    response_data['message'] = message
    return HttpResponse(json.dumps(response_data), content_type="application/json")
def error_reply(message=''):
    response_data = {}
    response_data['result'] = 'ERR'
    response_data['message'] = message
    return HttpResponse(json.dumps(response_data), content_type="application/json")
def waiting_reply(message=''):
    response_data = {}
    response_data['result'] = 'WAITING'
    response_data['message'] = message
    return HttpResponse(json.dumps(response_data), content_type="application/json")
def rendering_reply(message=''):
    response_data = {}
    response_data['result'] = 'RENDERING'
    response_data['message'] = message
    return HttpResponse(json.dumps(response_data), content_type="application/json")
def get_user(request):
    # User
    client_ip = get_client_ip(request)
    try:
        user = User.objects.get(username=client_ip)
    except User.DoesNotExist:
        user = User(username=client_ip)
        user.save()

    return user
 

@never_cache
@csrf_exempt
def register_node(request):
    data = json.loads(request.body)
    node_address = data["node_address"]
    node_gpu = data["node_gpu"]
    try:
        possible_node = Node.objects.get(address=node_address)
        possible_node.busy = False
        possible_node.save()
    except Node.DoesNotExist:
        node = Node(address=node_address, 
                    settings=json.dumps({'gpu' :node_gpu }),
                    last_access=datetime.now(pytz.timezone("America/Los_Angeles")))
        node.save()

    response_data = {}
    response_data['result'] = 'OK'
    return HttpResponse(json.dumps(response_data), content_type="application/json")

@never_cache
@csrf_exempt
def ping_node(request):
    data = json.loads(request.body)
    node_address = data["node_address"]
    node_gpu = data["node_gpu"]

    try:
        possible_node = Node.objects.get(address=node_address)
        possible_node.last_access = datetime.now(pytz.timezone("America/Los_Angeles"))
        possible_node.save()
    except Node.DoesNotExist:
        node = Node(address=node_address, 
                    settings=json.dumps({'gpu' :node_gpu }),
                    last_access=datetime.now(pytz.timezone("America/Los_Angeles")))
        node.save()
    print(f"Node ping: {node_address}")

    response_data = {}
    response_data['result'] = 'OK'
    return HttpResponse(json.dumps(response_data), content_type="application/json")

@never_cache
@csrf_exempt
def load_history(request):
    user = get_user(request)
    all_prompts = Prompt.objects.filter(owner=user)
    response_data = {}
    response_data['result'] = 'OK'
    response_data['prompts'] = []
    for prompt in all_prompts:
        p = {
            'prompt_id' : prompt.id,
            'prompt' : json.loads(prompt.prompt),

            'width' : prompt.width,
            'height' : prompt.height,

            'steps' : prompt.steps,
            'scale' : prompt.scale,
            'seed' : prompt.seed,

            'mode' : prompt.mode,

            'status' : prompt.status,
            'saved' : prompt.saved,
        }
        if prompt.mode == '2':
            p['init_strength'] = prompt.init_strength
            p['init_image_id'] = prompt.init_image.id 
            p['init_image_name'] = prompt.init_image.name

        response_data['prompts'].append(p)
    return HttpResponse(json.dumps(response_data), content_type="application/json")    

@never_cache
@csrf_exempt
def submit_prompt(request):
    
    try:
        data_to_process = request.POST['data'] if 'data' in request.POST.keys() else request.body
        data = json.loads(data_to_process)
        init_file_in_db = None
        if 'init_image' in request.FILES.keys():
            print(request.FILES['init_image'])
            try:
                img = Image.open(request.FILES['init_image'])
            except:
                return bad_request("image format is not supported.")

            appConfig = apps.get_app_config('mdrouter')
            storage_root = appConfig.server_config["server"]["storage"]

            prompt_ar = data['w'] / data['h']
            init_ar = img.size[0] / img.size[1]
            
            if prompt_ar > init_ar:
                v_offset = int((img.size[1] - img.size[0]/prompt_ar) /2)
                img = img.crop((0,v_offset, img.size[0], v_offset + img.size[0]/prompt_ar))
            else:
                h_offset = int((img.size[0] - img.size[1]/prompt_ar) /2)
                img = img.crop((h_offset,0,h_offset + img.size[1]/prompt_ar , img.size[1]))
            

            if prompt_ar > 1.0:
                target_width = 512 * prompt_ar
                target_width = int(target_width - (target_width % 64))
                target_height = 512
                img = img.resize((target_width, target_height), Image.Resampling.BICUBIC)
            else:
                target_height = 512 / prompt_ar
                target_height = int(target_height - (target_height % 64))
                target_width = 512
                img = img.resize((target_width, target_height), Image.Resampling.BICUBIC)
            init_image_location = f"{storage_root}/inits/{str(uuid.uuid4())}.png"
            img.save(init_image_location)
            init_file_in_db = File(
                location=init_image_location,
                name=str(request.FILES['init_image'])
                )
 
        # User
        user = get_user(request)

        # Prompt
        for k in ['prompt', 'w', 'h', 'steps', 'scale', 'seed', 'mode' ]:
            if k not in data.keys(): return bad_request(f"{k} is missing")

        prompts_in_progress = Prompt.objects.filter(status=0, owner=user).count()
        if prompts_in_progress >= 5:
            return bad_request("Too many prompts in the queue. Maximum is 5")
        new_request = Prompt(
            owner=user,
            prompt=json.dumps(data["prompt"]),
            safety=True,
            width=int(data['w']),
            height=int(data['h']),
            steps=int(data['steps']),
            scale=float(data['scale']),
            seed=int(data['seed']),
            mode=data['mode'],
            added_date=datetime.now(pytz.timezone("America/Los_Angeles"))
        )
        if init_file_in_db is not None:
            init_file_in_db.save()
            new_request.init_strength = 0.5
            new_request.init_image = init_file_in_db
        if 'init_strength' in data.keys():
            new_request.init_strength = float(data['init_strength'])

        new_request.save()

        response_data = {}
        response_data['result'] = 'OK'
        response_data['prompt_id'] = new_request.id
        if init_file_in_db is not None:
            response_data['init_image_id'] = init_file_in_db.id
            response_data['init_image_name'] = init_file_in_db.name

 
        return HttpResponse(json.dumps(response_data), content_type="application/json")
    except:
        return bad_request('no json data found')

@never_cache
@csrf_exempt
def check_prompt(request):

    try:
        data = json.loads(request.body)
        if 'prompt_id' not in data.keys(): return bad_request('prompt_id is missing')

        try:
            prompt = Prompt.objects.get(id=data['prompt_id'])
            if prompt.status == 0: return waiting_reply()
            elif prompt.status == 1: return rendering_reply()
            elif prompt.status == 2: return ok_reply() 
            else:
                return bad_request("status error")

        except Prompt.DoesNotExist:
            return bad_request('prompt does not exist')
    except:
        return bad_request('no json data found')


@csrf_exempt
def download_prompt(request):
    id_value = request.GET['prompt_id']
    try:
        prompt = Prompt.objects.get(id=id_value)
        if prompt.status == 2:
            output_file = prompt.output
            
            response = HttpResponse(content_type='image/png')   
            response['Content-Disposition'] = f"attachment; filename=\"{output_file.location}\""
            img = Image.open(output_file.location)
            img.save(response, "PNG")
            return response

        else:
            return bad_request('prompt is not ready')
    except Prompt.DoesNotExist:
        return bad_request('prompt does not exist')

  
@csrf_exempt
def save_prompt(request):
    data = json.loads(request.body)
    if 'prompt_id' not in data.keys(): return bad_request('prompt_id is missing')

    try:
        prompt = Prompt.objects.get(id=data['prompt_id'])
        prompt.saved = True
        prompt.save()
        return ok_reply()
    except Prompt.DoesNotExist:
        return bad_request("prompt does not exist")

@csrf_exempt
def delete_prompt(request):
    data = json.loads(request.body)
    if 'prompt_id' not in data.keys(): return error_reply('prompt_id is missing')

    try:
        prompt = Prompt.objects.get(id=data['prompt_id'])
        prompt.saved = True
        output_file = prompt.output
        os.remove(output_file.location)
        output_file.delete()
        prompt.delete()
        return ok_reply()
    except Prompt.DoesNotExist:
        return bad_request("prompt does not exist")

@never_cache
@csrf_exempt
def clear_cache(request):
    # Delete failed jobs
    print("Searching for failed prompts")
    time_threshold = datetime.now(pytz.timezone("America/Los_Angeles")) - timedelta(minutes=10)
    failed_prompts = Prompt.objects.filter(added_date__lt=time_threshold).exclude(status=2)
    for p in failed_prompts:
    
        print(f"Deleted: {p.id} - {p.prompt} - {p.status}")
        p.delete()
    # Delete jobs with no output
    print("Searching for prompts without output")
    no_outputs_prompts = Prompt.objects.filter(added_date__lt=time_threshold, output__isnull=True)
    for p in no_outputs_prompts:
    
        print(f"Deleted: {p.id} - {p.prompt} - {p.status}")
        p.delete()

    print("clearing")
    return ok_reply()