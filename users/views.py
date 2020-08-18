from django.shortcuts import render,redirect
from django.contrib import messages
from accounts.models import Register,Apps
import jwt
from decouple import config


# Create your views here.

def check_apps_autherization(req):
    try:
        apps = Apps.objects.filter(app_name='User').values("token")[0]
        value = jwt.decode(bytes(apps['token']), config('SECRET'), algorithms=['HS256'])
        return True
    except:
        print("error")

def session_check(req):
    if req.session['userRole'] == "Admin":
        return True
    else:
        messages.info(req, 'Login required')
        return redirect("login")

def home(req):
    if check_apps_autherization(req):
        if session_check(req):
            # print(req.session["userRole"])
            return render(req, 'home.html',{"name":req.session["userName"],"role":req.session["userRole"]})
    else:
        messages.info(req, 'User app auth fail')
        return redirect("login")

def profile(req):
    if check_apps_autherization(req) == True:
        if session_check(req):
            user = Register.objects.filter(email=req.session['userEmail']).values("name", "email", "role","mobileno")[0]
            return render(req, 'profile.html',{'user':user,"name":req.session["userName"],"role":req.session["userRole"]})
    else:
        messages.info(req, 'User app auth fail')
        return redirect("login")