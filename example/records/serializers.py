from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import *

class BandSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Band
        fields = ['url', 'name', 'genre']

class AlbumSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Album
        fields = ['url', 'name', 'genre', 'band']

class SongSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Song
        fields = ['url', 'name', 'genre', 'album']

class StoreSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Store
        fields = ['url', 'name', 'albums']
