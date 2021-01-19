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
