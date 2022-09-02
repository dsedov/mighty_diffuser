from django.shortcuts import render
from django.views.decorators.cache import never_cache
from django.http import HttpResponse
from django.http import FileResponse
import time, random
import uuid
from PIL import Image 
from .stable import generate, config, load_model
import json
import queue
import threading


class RenderQueueItem():
    def __init__(self, prompt, settings):
        self.prompt = prompt
        self.settings = settings 
        self.images = []
        self.id = str(uuid.uuid4())
        

class RenderQueue():
    def __init__(self):
        print("RQ: Starting render queue")
        self.finished_jobs = {}
        self.queue = queue.Queue()
        self.lock = lock = threading.Lock()
    def post_job(self, job):
        print("RQ: Received mew job")
        self.queue.put(job)
    def grab_job(self):
        return self.queue.get()
    def loop(self):
        print("RQ: Render server started")
        while(1):
            job = self.grab_job()
            print("RQ: Loaded job")

            job.images = generate(job.settings, f"{job.prompt}", global_model) 
            print(f"RQ: Rendered {len(job.images)} images")
            self.lock.acquire()
            self.finished_jobs[job.id] = job
            self.lock.release()
            print("RQ: Processed job")
    def get_job(self, id):
        self.lock.acquire()
        job = None
        if id in self.finished_jobs.keys():
            job = self.finished_jobs[id]
        self.lock.release()
        return job
    def start(self):
        threading.Thread(target=self.loop, daemon=True).start()

global_queue = RenderQueue()
global_queue.start()

cfg = config()
##cfg.config = "C:/Users/dsedov/sd/dev/mighty_diffuser/stable-diffusion/configs/stable-diffusion/v1-inference.yaml"
##cfg.ckpt = "C:/Users/dsedov/sd/dev/models/ldm/stable-diffusion-v1/model.ckpt"

cfg.config = "/home/dsedov/Dev/stable-diffusion/configs/stable-diffusion/v1-inference.yaml"
cfg.ckpt = "/home/dsedov/Dev/models/sd-v1-4.ckpt"

global_model = load_model(cfg.config, cfg.ckpt)
# Create your views here.
def sanitize_file_name(name):
    return name.replace(',','_').replace(':','_').lower()

@never_cache
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
def download_prompt(request):
    id_value = request.GET['id']
    job = global_queue.get_job(id_value)

    response = HttpResponse(content_type='image/png')   
    response['Content-Disposition'] = f"attachment; filename=\"{sanitize_file_name(job.prompt)}.png\""
    job.images[0].save(response, "PNG")
    return response

@never_cache
def txt2img(request):
    prompt_value = request.GET['q']
    try:
        if 'scale' in request.GET.keys():
            cfg.scale = int(request.GET['scale'])
        if 'w' in request.GET.keys():
            cfg.W = int(request.GET['w']) // 2
        if 'h' in request.GET.keys():
            cfg.H = int(request.GET['h']) // 2
        if 'steps' in request.GET.keys():
            cfg.ddim_steps = int(request.GET['steps'])
    except:
        print("ERROR")
  
    cfg.seed = 0
    images = generate(cfg, f"{prompt_value}", global_model) 

    img = images[0]
    response = HttpResponse(content_type='image/png')
    
    response["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response['Access-Control-Expose-Headers'] = 'seed-number,file-name'
    response["seed-number"] = cfg.seed
    response["file-name"] = f"{sanitize_file_name(prompt_value)}__{cfg.seed}.png"
    response['Content-Disposition'] = f"attachment; filename=\"{sanitize_file_name(prompt_value)}.png\""

    img.save(response, "PNG")
    return response