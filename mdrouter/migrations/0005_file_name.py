# Generated by Django 4.1 on 2022-09-28 15:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mdrouter', '0004_alter_prompt_mode_alter_user_username'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='name',
            field=models.CharField(max_length=128, null=True),
        ),
    ]
