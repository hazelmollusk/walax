from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import *

class BandSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Band
        fields = '__all__'

class AlbumSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Album
        fields = '__all__'

class SongSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Song
        fields = '__all__'

class StoreSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Store
        fields = '__all__'
