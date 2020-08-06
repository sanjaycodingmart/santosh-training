from django.urls import path
from . import views

urlpatterns = [
    path('admin', views.admin, name='admin'),
    path('user', views.user, name='user'),
    path('profile', views.profile, name='profile'),
    path('userlist', views.userlist, name='userlist')
]
