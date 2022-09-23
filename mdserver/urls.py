from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

from mdapp import views as md_views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('nodes/', include('mdnode.urls')),
    path('router/', include('mdrouter.urls')),

    path('', md_views.index), 
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)