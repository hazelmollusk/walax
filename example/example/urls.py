
from django.urls import path, include
from django.contrib.auth.models import User
from django.shortcuts import redirect
from rest_framework import routers, serializers, viewsets

urlpatterns = [
    path(r'', lambda req: redirect('records/')),
    path(r'records/', include('records.urls')),
    path(r'api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
