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
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

from mdapp import views as md_views  # This line is new
from mdrouter import views as mdrouter_views
urlpatterns = [

    path('register_node/', mdrouter_views.register_node),
    path('ping_node/', mdrouter_views.ping_node),

    path('submit_prompt/', mdrouter_views.submit_prompt),
    path('check_prompt/', mdrouter_views.check_prompt),
    path('download_prompt/',mdrouter_views.download_prompt),
    path('save_prompt/',mdrouter_views.save_prompt), 

]

