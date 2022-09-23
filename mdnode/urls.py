from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

from mdnode import views as mdnode_views
urlpatterns = [

    path('txt2img/', mdnode_views.txt2img),
    path('img2img/', mdnode_views.img2img),

]