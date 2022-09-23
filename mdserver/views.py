from xmlrpc.client import Boolean
from django.shortcuts import render
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.http import FileResponse
import random
import uuid, yaml
from PIL import Image 

import json
import queue
import threading
from PIL import Image


