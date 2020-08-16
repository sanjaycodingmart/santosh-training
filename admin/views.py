from django.shortcuts import render,redirect
from django.contrib import messages
from accounts.models import Register

# Create your views here.
def home(req):
    if req.session['userRole']=="Admin":
        # print(req.session["userRole"])
        return render(req, 'home.html',{"name":req.session["userName"],"role":req.session["userRole"]})
    else:
        messages.info(req, 'Login required')
        return redirect("login")

def userlist(req):
    print(req.method)
    if req.session['userRole'] == "Admin":
        db = Register.objects.filter(status=True,role='User').all().values("name", "email","mobileno")
        # print(db)
        return render(req,'userList.html',{'userlists':db,"name":req.session["userName"],"role":req.session["userRole"]})
    else:
        messages.info(req, 'Login required')
        return redirect("login")