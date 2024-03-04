from django.apps import AppConfig

class ContentConfig(AppConfig):
    default_auto_field = 'django.db.models.AutoField'
    name = 'content'

    def ready(self):
        import content.signals
