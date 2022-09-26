from xmlrpc.client import Boolean
from django.shortcuts import render
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseBadRequest
from django.http import FileResponse
from django.apps import apps
from .models import Node, Prompt, User
import random, pytz
from datetime import datetime
import uuid, yaml
from PIL import Image 
from mdnode.stable import config
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
def submit_prompt(request):
    appConfig = apps.get_app_config('mdrouter')
    try:
        data = json.loads(request.body)

        # User
        client_ip = get_client_ip(request)
        try:
            user = User.objects.get(username=client_ip)
        except User.DoesNotExist:
            user = User(username=client_ip)
            user.save()

        # Prompt
        for k in ['prompt', 'w', 'h', 'steps', 'scale', 'seed']:
            if k not in data.keys(): return bad_request(f"{k} is missing")
        new_request = Prompt(
            owner=user,
            prompt=data["prompt"],
            safety=True,
            width=int(data['w']),
            height=int(data['h']),
            steps=int(data['steps']),
            scale=float(data['scale']),
            added_date=datetime.now(pytz.timezone("America/Los_Angeles"))
        )
        new_request.save()

        response_data = {}
        response_data['result'] = 'OK'
        response_data['prompt_id'] = new_request.id
        return HttpResponse(json.dumps(response_data), content_type="application/json")
    except:
        return bad_request('no json data found')

@never_cache
@csrf_exempt
def check_prompt(request):
    appConfig = apps.get_app_config('mdrouter')
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

@never_cache
@csrf_exempt
def download_prompt(request):
    appConfig = apps.get_app_config('mdrouter')
    id_value = request.GET['id']
    job = appConfig.global_queue.get_job(id_value)

    response = HttpResponse(content_type='image/png')   
    response['Content-Disposition'] = f"attachment; filename=\"{sanitize_file_name(job.prompt)}_{job.settings.seed}.png\""
    job.images[0].save(response, "PNG")
    return response

from pathlib import Path
@csrf_exempt
def save_prompt(request):
    appConfig = apps.get_app_config('mdrouter')
    data = json.loads(request.body)
    if 'prompt_id' not in data.keys(): return bad_request('prompt_id is missing')

    try:
        prompt = Prompt.objects.get(id=data['prompt_id'])
        prompt.saved = True
        prompt.save()
        return ok_reply()
    except Prompt.DoesNotExist:
        return bad_request("prompt does not exist")



