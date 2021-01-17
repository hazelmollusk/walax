
from rest_framework.schemas import get_schema_view
from rest_framework import routers, serializers, viewsets

from py.walax.views import WalaxModelViewSet


class WalaxRouter(routers.DefaultRouter):
    def __init__(self):
        self.models = []

    def register_model(self, model, view=False):
        self.models.append(model)
        if not view:
            view = WalaxModelViewSet.for_model(model)
        self.register(view)

    def register_models(self, **models):
        for model in models:
            self.register_model(model)
 