from django.apps import AppConfig



import uuid, yaml
from PIL import Image 

import json
import queue
import threading
from PIL import Image
from .renderqueue import RenderQueue
from .nodes import RenderNodeManager

class MdrouterConfig(AppConfig):

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mdrouter'

    server_config = yaml.safe_load(open("config.yaml"))
    global_queue = None 
    node_manager = None

    def ready(self):
        print("Checking MD Router...")
        if self.server_config['server']['mode'] == 'router':
            print("Starting MD Router")

            self.node_manager = RenderNodeManager()
            self.global_queue = RenderQueue()
            self.global_queue.start()

            