from django.contrib.auth.models import Group, User
from django.shortcuts import render
from jinja2.nodes import Extends
from rest_framework import permissions, viewsets
from rest_framework.decorators import action

from .models import *
from .serializers import *

class ArikiCardViewSet(viewsets.ModelViewSet):
    queryset = ArikiCardBase.objects.all()
    serializer_class = ArikiCardSerializer
    permission_classes = []
    authentication_classes = []    