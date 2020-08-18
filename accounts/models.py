from django.db import models


# Create your models here.

class Apps(models.Model):
    app_name = models.CharField(max_length=100)
    token = models.BinaryField(max_length=500)

class Register(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=50,primary_key=True)
    password = models.CharField(max_length=200)
    forgot_password = models.CharField(max_length=200)
    role = models.CharField(max_length=7, default="User")
    status = models.BooleanField(default=True) #false to delete or reject the user
    mobileno = models.CharField(max_length=12)


