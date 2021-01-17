import uuid
from django.db import models

class WalaxModel(models.Model):
    walax_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
