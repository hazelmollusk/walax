from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import *


class WalaxModelSerializer(serializers.HyperlinkedModelSerializer):
    def create(self, data):
        return self.Meta.model.objects.create(**data)

    def update(self, instance, data):
        for attr, value in data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class BandSerializer(WalaxModelSerializer):
    class Meta:
        model = Band
        fields = '__all__'


class AlbumSerializer(WalaxModelSerializer):
    class Meta:
        model = Album
        fields = '__all__'


class SongSerializer(WalaxModelSerializer):
    class Meta:
        model = Song
        fields = '__all__'


class StoreSerializer(WalaxModelSerializer):
    class Meta:
        model = Store
        fields = '__all__'
