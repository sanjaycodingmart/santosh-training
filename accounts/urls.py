from django.urls import path
from . import views

urlpatterns = [
    path('', views.login, name='login'),
    path('login',views.login,name='login'),
    path('googlesignin',views.googlesignin,name='googlesignin'),
    path('register', views.register, name='register'),
    path('forgotpassword', views.forgotpassword, name='forgotpassword'),
    path('resetpassword/<str:hash>', views.resetpassword, name='resetpassword'),
    path('home/logout',views.logout,name='logout'),
    path('home/changepassword',views.changepassword,name='change password'),
    path('home/changemobileno',views.changemobileno,name='change mobileno'),
    path('home/delete/<str:email>', views.delete, name='delete'),
     path('home/adminedit/<str:email>',views.adminedit,name='adminedit')
]
