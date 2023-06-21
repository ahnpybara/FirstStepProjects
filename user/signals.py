from django.db.models.signals import post_delete
from django.dispatch import receiver
from content.models import Feed, Like, Reply, Bookmark, Follow, ShareCategory, Chat, Alert
from user.models import User


@receiver(post_delete, sender=User)
def delete_user_related(sender, instance, using, **kwargs):
    Feed.objects.filter(email=instance.email).delete()
    Like.objects.filter(email=instance.email).delete()
    Reply.objects.filter(email=instance.email).delete()
    Bookmark.objects.filter(email=instance.email).delete()

    Follow.objects.filter(follower=instance.email).delete()
    Follow.objects.filter(following=instance.email).delete()
    ShareCategory.objects.filter(email=instance.email).delete()

    Chat.objects.filter(send_user=instance.email).delete()
    Chat.objects.filter(receive_user=instance.email).delete()

    Alert.objects.filter(send_user=instance.email).delete()
    Alert.objects.filter(receive_user=instance.email).delete()
