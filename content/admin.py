from django.contrib import admin

from content.models import Feed, Reply, Image, Hashtag, ShareCategory, Chat

# Register your models here.
admin.site.register(Feed)
admin.site.register(Reply)
admin.site.register(Chat)
