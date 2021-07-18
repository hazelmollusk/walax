from django.apps import AppConfig


class RecordsConfig(AppConfig):
    name = 'records'
    # This doesn't work
    # https://code.djangoproject.com/ticket/32577
    # default_auto_field = 'django.db.models.UUIDField'