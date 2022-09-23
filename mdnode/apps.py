from django.apps import AppConfig
import yaml
import random
import uuid, yaml
from PIL import Image 
from .stable import generate, config, load_model, prepare_mask
import queue
import threading
from PIL import Image
import requests, json, io

class MdnodeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mdnode'
    server_config = yaml.safe_load(open("config.yaml"))
    cfg = config()
    model = None

    def ready(self):
        print("Checking MD Node...")
        if(self.server_config["server"]["mode"] == 'node'):
            print("Starting MD Node")
            self.cfg.config = self.server_config["stable_diffusion"]["config"]
            self.cfg.ckpt   = self.server_config["stable_diffusion"]["checkpoint"]
            #self.model = load_model(self.cfg.config, self.cfg.ckpt)

            print("Registering with Router")
            requestSetting = json.dumps({
                'node_address' : self.server_config["server"]["node_address"],
                'gpu' : '2080',
            })
            r = requests.post('http://' + self.server_config["server"]["router_address"] + "/router/register_node/", json=requestSetting)
            if r.status_code == 200:
                print(r.json())