from django.contrib.auth.models import Group, User
from django.shortcuts import render
from jinja2.nodes import Extends
from rest_framework import permissions, viewsets
from rest_framework.decorators import action

from .models import *
from .serializers import *


class WalaxViewSet(viewsets.ModelViewSet):
    pass


class BandViewSet(WalaxViewSet):
    queryset = Band.objects.all()
    serializer_class = BandSerializer
    permission_classes = [permissions.AllowAny]


class AlbumViewSet(WalaxViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    permission_classes = [permissions.AllowAny]


class SongViewSet(WalaxViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    permission_classes = [permissions.AllowAny]


class StoreViewSet(WalaxViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [permissions.AllowAny]
