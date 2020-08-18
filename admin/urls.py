from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='admin'),
    path('profile',views.profile,name='admin profile'),
    path('userlist', views.userlist, name='userlist')
]
