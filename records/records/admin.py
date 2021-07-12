from django.contrib import admin
from .models import Band, Album, Song, Store, Inventory

admin.site.register(Band)
admin.site.register(Album)
admin.site.register(Song)

class InventoryInline(admin.TabularInline):
    model = Inventory
    extra = 1

class StoreAdmin(admin.ModelAdmin):
    inlines = (InventoryInline,)

# admin.site.register(Inventory)
admin.site.register(Store, StoreAdmin)