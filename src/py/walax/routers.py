from django.urls import include, path
from rest_framework.schemas import get_schema_view
from rest_framework import routers, serializers, viewsets
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from .views import WalaxModelViewSet


class WalaxRouter(routers.DefaultRouter):

    def __init__(self):
        super().__init__()
        self.models = []
        self.registry = []
        self.views = {}

    def register_model(self, model=False, view=False):
        self.models.append(model)
        if not view:
            view = WalaxModelViewSet.for_model(model)
        # fixme
        modelSlug = model._meta.verbose_name.replace(' ', '_')

        self.register(modelSlug, view)

    def register_view(self, url, view):
        self.views[url] = view

    @ property
    def urls(self):
        urlpatterns = [
            path('auth/token/', TokenObtainPairView.       as_view(),
                 name='token_obtain_pair'),
            path('auth/token/refresh/', TokenRefreshView.  as_view(),
                 name='token_refresh'),
            path('auth/token/verify/',
                 TokenVerifyView.    as_view(), name='token_verify'),
            path('models/', include(super().urls))
        ]
        for url, view in self.views.items():
            urlpatterns.append(path(url, view))
        return urlpatterns
