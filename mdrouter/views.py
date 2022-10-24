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

            'output_image_id' : prompt.output.id,
            'output_image_name' : prompt.output.name,

            'init_strength' : 0.5,
        }
        if prompt.mode == '0' or prompt.mode == '1':
            p['init_strength'] = 0.5
            p['init_image_id'] = prompt.output.id 
            p['init_image_name'] = prompt.output.name
        elif prompt.mode == '2':
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
            print("Init image with attachment")
            try:
                img = Image.open(request.FILES['init_image'])
            except:
                return bad_request("image format is not supported.")

            appConfig = apps.get_app_config('mdrouter')
            storage_root = appConfig.server_config["server"]["storage"]

            init_width = img.size[0]
            init_height = img.size[1]
            prompt_width = data['w']
            prompt_height = data['h']
            prompt_ar = float(data['w']) / float(data['h'])
            init_ar = img.size[0] / float(img.size[1])

            if init_ar > prompt_ar:
                # crop the left and right edges:
                new_width = int(prompt_ar * init_height)
                offset = (init_width - new_width) / 2
                resize = (offset, 0, init_width - offset, init_height)
            else:
                # crop the top and bottom:
                new_height = int(init_width / prompt_ar)
                offset = (init_height - new_height) / 2
                resize = (0, offset, init_width, init_height - offset)
            img = img.crop(resize).resize((prompt_width, prompt_height), Image.Resampling.BICUBIC)

            init_image_location = f"{storage_root}/inits/{str(uuid.uuid4())}.png"
            img.save(init_image_location)
            init_file_in_db = File(
                location=init_image_location,
                name=str(request.FILES['init_image'])
                )
        elif 'init_image_id' in data.keys():
            print(f"Init image with existing image {data['init_image_id']}")
            try:
                img_object = File.objects.get(id=int(data['init_image_id']))
                img = Image.open(img_object.location)
                init_width = img.size[0]
                init_height = img.size[1]
                prompt_width = data['w']
                prompt_height = data['h']

                if img.size[0] != data['w'] or img.size[1] != data['h']:
                    appConfig = apps.get_app_config('mdrouter')
                    storage_root = appConfig.server_config["server"]["storage"]
                    
                    prompt_ar = float(data['w']) / float(data['h'])
                    init_ar = img.size[0] / float(img.size[1])
                    
                    if init_ar > prompt_ar:
                        # crop the left and right edges:
                        new_width = int(prompt_ar * init_height)
                        offset = (init_width - new_width) / 2
                        resize = (offset, 0, init_width - offset, init_height)
                    else:
                        # crop the top and bottom:
                        new_height = int(init_width / prompt_ar)
                        offset = (init_height - new_height) / 2
                        resize = (0, offset, init_width, init_height - offset)
                    img = img.crop(resize).resize((prompt_width, prompt_height), Image.Resampling.BICUBIC)

                    init_image_location = f"{storage_root}/inits/{str(uuid.uuid4())}.png"
                    img.save(init_image_location)
                    init_file_in_db = File(
                        location=init_image_location,
                        name=img_object.name
                        )
                else:
                    init_file_in_db = img_object
            except File.DoesNotExist:
                return bad_request('Init file was not found in the database')
            except FileNotFoundError:
                return bad_request('Physical init file was not found on the server')
        
        print("Continue prompt submission")
        # User
        user = get_user(request)

        # Prompt
        for k in ['prompt', 'w', 'h', 'steps', 'scale', 'seed', 'mode' ]:
            if k not in data.keys(): return bad_request(f"{k} is missing")
        
        safety = True 
        if 'safety' in data.keys():
            safety = data['safety']

        prompts_in_progress = Prompt.objects.filter(status=0, owner=user).count()
        if prompts_in_progress >= 5:
            return bad_request("Too many prompts in the queue. Maximum is 5")
        new_request = Prompt(
            owner=user,
            prompt=json.dumps(data["prompt"]),
            safety=safety,
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

        new_output_target = File(location='')
        new_output_target.save()
        new_request.output = new_output_target
        new_request.save()

        response_data = {}
        response_data['result'] = 'OK'
        response_data['prompt_id'] = new_request.id
        response_data['output_image_id'] = new_output_target.id
        response_data['output_image_name'] = new_request.prompt[1:50] + '..'
        response_data['init_image_id'] = new_output_target.id
        response_data['init_image_name'] = new_request.prompt[1:50] + '..'
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
        
        # Clear output file
        output_file = prompt.output
        if Prompt.objects.filter(init_image=output_file).count() == 0:
            os.remove(output_file.location)
            output_file.delete()

        # Clear init file
        if prompt.init_image != None:
            init_image = prompt.init_image
            if Prompt.objects.filter(init_image=init_image).exclude(id=prompt.id).count() == 0:
                os.remove(init_image.location)
                init_image.delete()

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