# Generated by Django 3.2.18 on 2023-06-06 23:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0006_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='feed',
            name='image',
        ),
    ]
