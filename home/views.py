from django.shortcuts import render,redirect
from django.contrib import messages
from accounts.models import Register

# Create your views here.
def admin(req):
    if req.session['userRole']=="Admin":
        return render(req, 'adminHome.html',{"name":req.session["userName"]})
    else:
        messages.info(req, 'Login required')
        return redirect("login")

def user(req):
    if req.session['userRole']=="User":
        return render(req, 'userHome.html',{"name":req.session["userName"]})
    else:
        messages.info(req, 'Login required')
        return redirect("login")

def profile(req):
    try:
        user = Register.objects.filter(email=req.session['userEmail']).values("name", "email", "role","mobileno")[0]
        print(user)
        if req.session['userRole']=="User":
            return render(req, 'userProfile.html',{'user':user})
        elif req.session['userRole'] == "Admin":
            return render(req, 'AdminProfile.html',{'user':user})
    except:
        messages.info(req, 'Login required')
        return redirect("login")

def userlist(req):
    if req.session['userRole'] == "Admin":
        db = Register.objects.filter(status=True,role='User').all().values("name", "email","mobileno")
        print(db)
        return render(req,'userList.html',{'userlists':db})
    else:
        messages.info(req, 'Login required')
        return redirect("login")