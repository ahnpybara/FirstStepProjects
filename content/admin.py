from django.contrib import admin

from content.models import Feed, Reply, Image, Hashtag, ShareCategory, Chat

# Register your models here.
admin.site.register(Feed)
admin.site.register(Reply)
admin.site.register(Image)
admin.site.register(Hashtag)
admin.site.register(ShareCategory)
admin.site.register(Chat)
