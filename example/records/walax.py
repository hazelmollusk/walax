from rest_framework.serializers import HyperlinkedModelSerializer
from rest_framework.routers import SimpleRouter, Route

class WalaxModelSerializer(serializers.HyperlinkedModelSerializer):
    pass

class WalaxRouter(SimpleRouter):

    routes = SimpleRouter.routes + [

    ]
