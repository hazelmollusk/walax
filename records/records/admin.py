from django.contrib import admin
from .models import Band, Album, Song, Store, Inventory

admin.site.register(Band)
admin.site.register(Album)
admin.site.register(Song)
admin.site.register(Store)
admin.site.register(Inventory)