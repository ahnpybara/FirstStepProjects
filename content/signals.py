from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Feed, Image, Like, Reply, Bookmark, Hashtag, ShareCategory, Alert


@receiver(post_delete, sender=Feed)
def delete_related_objects(sender, instance, **kwargs):
    Image.objects.filter(feed_id=instance.id).delete()
    Like.objects.filter(feed_id=instance.id).delete()
    Reply.objects.filter(feed_id=instance.id).delete()
    Bookmark.objects.filter(feed_id=instance.id).delete()
    Hashtag.objects.filter(feed_id=instance.id).delete()
    ShareCategory.objects.filter(feed_id=instance.id).delete()
    Alert.objects.filter(feed_id=instance.id).delete()