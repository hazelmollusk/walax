from django.urls import include, path
from rest_framework.schemas import get_schema_view
from rest_framework import routers, serializers, viewsets

from .views import WalaxModelViewSet


class WalaxRouter(routers.DefaultRouter):

    def __init__(self):
        super().__init__()
        self.models = []
        self.registry = []

    def register_model(self, model=False, view=False):
        self.models.append(model)
        if not view:
            view = WalaxModelViewSet.for_model(model)
        # fixme
        modelSlug = model._meta.verbose_name.replace(' ', '_')

        self.register(modelSlug, view)

    @property
    def urls(self):
        urlpatterns = [
            path('models/', include(super().urls))
        ]
        return urlpatterns
