from django.shortcuts import render,redirect
from django.contrib import messages
from accounts.models import Register

# Create your views here.
def home(req):
    if req.session['userRole']=="User":
        # print(req.session["userRole"])
        return render(req, 'home.html',{"name":req.session["userName"],"role":req.session["userRole"]})
    else:
        messages.info(req, 'Login required')
        return redirect("login")


def profile(req):
    if req.session['userRole']=="User" or req.session['userRole'] == "Admin":
        user = Register.objects.filter(email=req.session['userEmail']).values("name", "email", "role","mobileno")[0]
        return render(req, 'profile.html',{'user':user,"name":req.session["userName"],"role":req.session["userRole"]})
    else:
        messages.info(req, 'Login required')
        return redirect("login")
