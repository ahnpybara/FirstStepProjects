# Generated by Django 3.2.18 on 2023-05-21 03:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0004_follow'),
    ]

    operations = [
        migrations.CreateModel(
            name='Hashtag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('feed_id', models.IntegerField(default=0)),
                ('content', models.TextField()),
            ],
        ),
    ]