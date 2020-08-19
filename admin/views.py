from django.shortcuts import render,redirect
from django.contrib import messages
from accounts.models import Register,Apps
import jwt
from decouple import config


# Create your views here.

def check_apps_autherization(req):
    try:
        apps = Apps.objects.filter(app_name='Admin').values("token")[0]
        value = jwt.decode(bytes(apps['token']), config('SECRET'), algorithms=['HS256'])
        return True
    except:
        print("error")

def session_check(req):
    try:
        if req.session['userRole'] == "Admin":
            print("call")
            return True
        else:
            return False
    except:
        return False

def home(req):
    if check_apps_autherization(req)==True:
        if session_check(req)==True:
            # print(req.session["userRole"])
            return render(req, 'home.html',{"name":req.session["userName"],"role":req.session["userRole"]})
    messages.info(req, 'Admin app auth fail')
    return redirect("login")

def userlist(req):
    if check_apps_autherization(req)==True:
        if session_check(req)==True:
            db = Register.objects.filter(status=True,role='User').all().values("name", "email","mobileno")
            # print(db)
            return render(req, 'userList.html', {'userlists': db, "name": req.session["userName"], "role": req.session["userRole"]})
    messages.info(req, 'Admin app auth fail')
    return redirect("login")

def profile(req):
    if check_apps_autherization(req)==True:
        if session_check(req)==True:
            user = Register.objects.filter(email=req.session['userEmail']).values("name", "email", "role","mobileno")[0]
            return render(req, 'profile.html',{'user':user,"name":req.session["userName"],"role":req.session["userRole"]})
    messages.info(req, 'Admin app auth fail')
    return redirect("login")