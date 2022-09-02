"""mdserver URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from mdapp import views as md_views  # This line is new
from mdserver import views as md_server_views
urlpatterns = [
    path('admin/', admin.site.urls),

    path('submit_prompt/', md_server_views.submit_prompt),
    path('check_prompt/', md_server_views.check_prompt),
    path('download_prompt/',md_server_views.download_prompt),

    path('txt2img/', md_server_views.txt2img),

    path('/', md_views.index),  # This line is new
]