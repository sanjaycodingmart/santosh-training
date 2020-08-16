from django.urls import path
from . import views

urlpatterns = [
    path('admin', views.home, name='admin'),
    path('user', views.home, name='user'),
    path('profile', views.profile, name='profile'),
    path('userlist', views.userlist, name='userlist')
]
