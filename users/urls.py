from django.urls import path
from . import views

urlpatterns = [
    path('user', views.home, name='user'),
    path('profile', views.profile, name='profile')
]
