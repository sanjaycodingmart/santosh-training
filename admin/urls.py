from django.urls import path
from . import views

urlpatterns = [
    path('admin', views.home, name='admin'),
    path('userlist', views.userlist, name='userlist')
]
