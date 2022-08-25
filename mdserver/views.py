from django.shortcuts import render
from django.http import HttpResponse
from django.http import FileResponse
from PIL import Image 
# Create your views here.
def prompt(request):
    prompt_value = request.GET['q']
    img = Image.open('somefile.png')
    response = HttpResponse(content_type='image/jpg')
    img.save(response, "JPEG")
    response['Content-Disposition'] = f"attachment; filename=\"{prompt_value}.jpg\""
    return response