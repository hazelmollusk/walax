from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import *


class WalaxSerializer(serializers.HyperlinkedModelSerializer):
    def create(self, data):
        return self.Meta.model.objects.create(**data)

    def update(self, instance, data):
        return 'whoops'


class BandSerializer(WalaxSerializer):
    class Meta:
        model = Band
        fields = '__all__'
        permission_classes = []
        


class AlbumSerializer(WalaxSerializer):
    class Meta:
        model = Album
        fields = '__all__'
        permission_classes = []


class SongSerializer(WalaxSerializer):
    class Meta:
        model = Song
        fields = '__all__'
        permission_classes = []


class StoreSerializer(WalaxSerializer):
    class Meta:
        model = Store
        fields = '__all__'
        permission_classes = []
