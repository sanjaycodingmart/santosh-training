from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='user'),
    path('profile', views.profile, name='user profile')
]
