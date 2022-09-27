from time import sleep
from django.apps import AppConfig
import yaml
import random
import uuid, yaml
from PIL import Image 
from .stable import generate, config, load_model, prepare_mask
import queue
import threading
from PIL import Image
import requests, json, io, os
import threading
class MdnodeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mdnode'
    server_config = yaml.safe_load(open("config.yaml"))
    cfg = config()
    model = None
    def ping(self):
        while(1):
            print("Ping server")
            try:
                r = requests.post('http://' + self.server_config["server"]["router_address"] + "/router/ping_node/", 
                            json={ 
                                    'node_address' : self.server_config["server"]["node_address"],
                                    'node_gpu' : '2080', 
                                })
                if r.status_code != 200:
                    sleep(60)
            except:
                print("timed out")
            sleep(5)
    def ready(self):
        os.environ["CUDA_DEVICE_ORDER"]="PCI_BUS_ID"   
        os.environ["CUDA_VISIBLE_DEVICES"]=self.server_config["stable_diffusion"]["gpu_num"]
        
        if os.environ.get('RUN_MAIN', None) == 'true':
            print("-- using GPU:" + self.server_config["stable_diffusion"]["gpu_num"])
            print("Checking MD Node...")
            if(self.server_config["server"]["mode"] == 'node'):
                print("Starting MD Node")
                self.cfg.config = self.server_config["stable_diffusion"]["config"]
                self.cfg.ckpt   = self.server_config["stable_diffusion"]["checkpoint"]
                self.model = load_model(self.cfg.config, 
                                        self.cfg.ckpt, 
                                        gpu=(self.server_config["stable_diffusion"]["device"]=='cuda')
                                        )

                print("Registering with Router")
                while(1):
                    try:
                        r = requests.post('http://' + self.server_config["server"]["router_address"] + "/router/register_node/", 
                                json={ 
                                        'node_address' : self.server_config["server"]["node_address"],
                                        'node_gpu' : '2080', 
                                    })
                        if r.status_code == 200:
                            threading.Thread(target=self.ping, daemon=True).start()
                            print(r.json())
                            break
                        else:
                            print("Error connecting to server")
                            sleep(5)
                    except:
                        print("Still trying to connect")
                        sleep(5)
                    
