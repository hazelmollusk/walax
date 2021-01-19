from django.shortcuts import render
from rest_framework import viewsets, permissions
from .serializers import WalaxModelSerializer


class WalaxModelViewSet(viewsets.ModelViewSet):

    @staticmethod
    def for_model(modelo, serializer=None):

        if not serializer:
            class aWalaxModelSerializer(WalaxModelSerializer):
                class Meta:
                    model = modelo
                    fields = '__all__'
            serializer = aWalaxModelSerializer

        class aWalaxModelViewSet(WalaxModelViewSet):
            serializer_class = aWalaxModelSerializer
            queryset = modelo.objects.all()
            permission_classes = [permissions.AllowAny]

        return aWalaxModelViewSet
