from django.shortcuts import render
from rest_framework import viewsets
from .serializers import WalaxModelSerializer


class WalaxModelViewSet(viewsets.ModelViewSet):
    @staticmethod
    def for_model(model):
        class aWalaxModelSerializer(WalaxModelSerializer):
            class Meta:
                model = model
                fields = '__all__'

        class aWalaxModelViewSet(WalaxModelViewSet):
            serializer_class = aWalaxModelSerializer
            queryset = model.objects.all()

        return aWalaxModelViewSet
