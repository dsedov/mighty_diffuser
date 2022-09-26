from django.contrib import admin
from .models import Node, User, File, Prompt 
# Register your models here.
admin.site.register(Node)
admin.site.register(User)
admin.site.register(File)
admin.site.register(Prompt)