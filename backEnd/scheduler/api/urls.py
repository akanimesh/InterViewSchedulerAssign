from rest_framework.routers import DefaultRouter
from django.urls import path, include

from . import views

app_name = "schduler"

router = DefaultRouter()
router.register("interview", views.MeetViewSet, basename="interview")
router.register("user", views.UserViewSet, basename="user")
urlpatterns=router.urls
urlpatterns +=[
    path('login/', views.LoginView.as_view()),
]
