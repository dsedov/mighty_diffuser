from django.apps import AppConfig

import uuid, yaml, os
from PIL import Image 

import json
import queue
import threading
from PIL import Image


class MdrouterConfig(AppConfig):

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mdrouter'

    server_config = yaml.safe_load(open("config.yaml"))
    global_queue = None 
    node_manager = None

    def ready(self):
        if os.environ.get('RUN_MAIN', None) == 'true':
            print("Checking MD Router...")
            if self.server_config['server']['mode'] == 'router':
                from .renderqueue import RenderQueue
                print("Starting MD Router")
                self.global_queue = RenderQueue()
                self.global_queue.start()

            