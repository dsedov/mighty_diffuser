from time import sleep
import threading, requests, json, io
from PIL import Image
from .models import Prompt, Node
from datetime import datetime, timedelta
import pytz
class RenderQueue():
    def __init__(self):
        print("- Starting Render Queue") 
        self.lock = threading.Lock()
    
    def render(self, prompt, node):  
        r = requests.post(f"http://{node.address}/nodes/txt2img/", json={
            'prompt' : prompt.prompt,
            'width' : prompt.width,
            'height' : prompt.height,
            'scale' : prompt.scale,
            'seed' : prompt.seed,
            'steps' : prompt.steps,
            'safety' : prompt.safety
        })
        if r.status_code == 200:
            print(r.headers)
            filename = r.headers["filename"]
            image_bytes = io.BytesIO(r.content)
            img = Image.open(image_bytes)
            img.show()
            node.busy = False 
            node.save()
            prompt.status = 2
            prompt.save()
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
