from time import sleep
import threading, requests, json, io
from PIL import Image
from .models import Prompt, Node, File
from datetime import datetime, timedelta
import pytz, uuid, re
from django.apps import apps
class RenderQueue():
    def __init__(self):
        print("- Starting Render Queue") 
        self.lock = threading.Lock()
    def sanitize_file_name(name):
        name = re.sub(r'[^a-z_A-Z0-9]', '', name.replace(' ', '_'))
        return name.lower()
    def render(self, prompt, node):  
        r = requests.post(f"http://{node.address}/nodes/txt2img/", json={
            'prompt' : json.loads(prompt.prompt),
            'width' : prompt.width,
            'height' : prompt.height,
            'scale' : prompt.scale,
            'seed' : prompt.seed,
            'steps' : prompt.steps,
            'safety' : prompt.safety
        })
        if r.status_code == 200:
            appConfig = apps.get_app_config('mdrouter')
            storage_root = appConfig.server_config["server"]["storage"]

            image_bytes = io.BytesIO(r.content)
            img = Image.open(image_bytes)
            truncated_prompt = (prompt.prompt[:100] + '..') if len(prompt.prompt) > 100 else prompt.prompt
            file_name = f"{RenderQueue.sanitize_file_name(truncated_prompt)}_{int(prompt.seed)}_{str(uuid.uuid4())}.png"
            file_location = f"{storage_root}/storage/{file_name}"
            img.save(file_location)
            file_in_db = File(location=file_location)
            file_in_db.save()
            prompt.output = file_in_db
            prompt.status = 2
            prompt.save()

            node.busy = False 
            node.save()
            
            print("image rendered")
        else:
            print("image failed")
            node.busy = True 
            node.save()
            prompt.status = 3
            prompt.save()

    def loop(self):
        print("RQ: Render server started")
        while(1):
            prompt_to_render = Prompt.objects.all().filter(status=0).order_by('added_date').first()
            if prompt_to_render:
                time_threshold = datetime.now(pytz.timezone("America/Los_Angeles")) - timedelta(seconds=10)
                node_to_use = Node.objects.all().filter(busy=False, last_access__gt=time_threshold).order_by('last_access').first()
                if node_to_use:
                    node_to_use.busy = True 
                    node_to_use.save()
                    prompt_to_render.status = 1
                    prompt_to_render.save()
                    threading.Thread(target=self.render, daemon=True, args=(prompt_to_render, node_to_use,)).start()

                    print("sending prompt to render")
                else:
                    print("no free nodes")
            sleep(1)

    
    def start(self):
        threading.Thread(target=self.loop, daemon=True).start()
