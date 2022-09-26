from django.db import models


class Node(models.Model):
    address = models.CharField(max_length=128)
    settings = models.TextField(null=True)
    busy = models.BooleanField(default=False)
    last_access = models.DateTimeField()

class User(models.Model):
    username = models.CharField(max_length=64)

class File(models.Model):
    location = models.CharField(max_length=512)

class Prompt(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    prompt = models.TextField()
    safety = models.BooleanField(default=True)
    seed = models.IntegerField()
    width = models.IntegerField(default=512)
    height = models.IntegerField(default=512)
    steps = models.IntegerField(default=25)
    scale = models.FloatField(default=7.0)
    seed = models.IntegerField(default=42)

    init_image = models.ForeignKey(File, null=True, on_delete=models.SET_NULL, related_name='init_image')
    init_mask = models.ForeignKey(File, null=True, on_delete=models.SET_NULL, related_name='init_mask')
    init_strength = models.FloatField(null=True)

    node = models.ForeignKey(Node, null=True, on_delete=models.SET_NULL)
    status = models.IntegerField(default=0)
    output = models.ForeignKey(File, null=True, on_delete=models.SET_NULL, related_name='output')

    saved = models.BooleanField(default=False)
    added_date = models.DateTimeField()