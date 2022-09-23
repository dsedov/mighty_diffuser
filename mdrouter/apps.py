from django.apps import AppConfig



import uuid, yaml
from PIL import Image 

import json
import queue
import threading
from PIL import Image
from .renderqueue import RenderQueue

class MdrouterConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mdrouter'
    server_config = yaml.safe_load(open("config.yaml"))
    global_queue = None 

    def ready(self):
        print("Checking MD Router...")
        if self.server_config['server']['mode'] == 'router':
            print("Starting MD Router")
            global_queue = RenderQueue()
            global_queue.start()