import uuid
from django.db import models


class WalaxModel(models.Model):
    xin = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        app_label = 'walax'
        abstract = True
