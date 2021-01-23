import uuid
from django.db import models
from rest_framework.decorators import action



class WalaxModel(models.Model):
    walax_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        app_label = 'walax'
