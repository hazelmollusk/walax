from django.contrib.auth.models import Group, User
from django.shortcuts import render
from jinja2.nodes import Extends
from rest_framework import permissions, viewsets
from rest_framework.decorators import action

from .models import *
from .serializers import *


class BandViewSet(viewsets.ModelViewSet):
    queryset = Band.objects.all()
    serializer_class = BandSerializer
    permission_classes = []
    authentication_classes = []


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    permission_classes = []
    authentication_classes = []


class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    permission_classes = []
    authentication_classes = []


class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = []
    authentication_classes = []
