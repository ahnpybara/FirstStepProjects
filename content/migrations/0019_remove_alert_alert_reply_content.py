# Generated by Django 3.2.18 on 2023-06-15 00:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0018_rename_reply_content_alert_alert_reply_content'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='alert',
            name='alert_reply_content',
        ),
    ]
