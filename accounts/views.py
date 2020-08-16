from django.shortcuts import render,redirect
from django.contrib.auth.hashers import make_password, check_password
from django.utils.crypto import get_random_string
# import bcrypt
from django.contrib.auth.models import User
from django.contrib import messages
from accounts.models import Register
from django.core.mail import EmailMessage
import string
from decouple import config
from time import gmtime,strftime
import requests
import threading

# Create your views here.

class EmailMessageThread(threading.Thread):
    def __init__(self, email):
        self.email = email
        threading.Thread.__init__(self)

    def run(self):
        self.email.send()

def emailthread(email):
    email.send()

def register(req):
    if req.method == 'POST':
        name = req.POST['name']
        email = req.POST['email']
        mobileno = req.POST['mobileno']
        password = make_password(req.POST['password'])
        print(password)
        if Register.objects.filter(email=email).exists():
            messages.info(req, 'Email Taken')
            return redirect("register")
        else:
            user = Register.objects.create(name=name,email=email,password=password,forgot_password="",mobileno=mobileno)
            user.save()
            messages.info(req, 'Register successfully')
            return redirect('login')
    else:
        return render(req,'register.html')



def login(req):
    if req.method != 'POST':
        return render(req,'login.html')
    else:
        email = req.POST['email']
        password = req.POST['password']
        if Register.objects.filter(email=email).exists():
            dbData = Register.objects.filter(email=email).values("status","password","name","email","role")[0]
            # print(dbData)
            if dbData['status']:
                # print(check_password(password ,dbData['password']))
                if check_password(password, dbData['password']):
                    req.session['userRole'] = dbData['role']
                    req.session['userEmail'] = dbData['email']
                    req.session['userName'] = dbData['name']
                    if dbData['role'] == "Admin":
                        return redirect("home/admin")
                    else:
                        return redirect("home/user")
                else:
                    messages.info(req, 'Password not match')
                    return redirect("login")
            else:
                messages.info(req, 'You are rejected by admin')
                return redirect("login")
        else:
            messages.info(req, 'Email not exits')
            return redirect("login")

def googlesignin(req):
    if req.method == 'GET' and req.user:
        dbUser = User.objects.filter(username=req.user).values('username','email','password')[0]
        # print(db['email'])
        try:
            dbRegister = Register.objects.filter(email=dbUser['email']).values('name', 'email','status')[0]
        except:
            dbRegister = Register.objects.create(name=dbUser['username'],email=dbUser['email'],password=dbUser['password'],forgot_password="",mobileno="")
        if dbRegister['status']:
            req.session['userName'] = dbRegister['name']
            req.session['userEmail'] = dbRegister['email']
            req.session['userRole'] = 'User'
            dbUser['username'] = ' '
            return redirect("home/user")
        else:
            messages.info(req, 'You are rejected by admin')
            return redirect("login")
    else:
        messages.info(req, 'Try Again!!')
        return redirect("login")

def logout(req):
    req.session['userRole']=''
    req.session['userName'] = ''
    req.session['userEmail'] = ''
    messages.info(req, 'Logout success')
    return redirect("login")

def changepassword(req):
    if req.session['userEmail'] is not None:
        oldpassword = req.POST['oldpassword']
        newpassword = req.POST['newpassword']
        db = Register.objects.get(email=req.session['userEmail'])
        if check_password(oldpassword, db.password):
            db.password= make_password(newpassword)
            db.save()
            red = req.session['userRole'].lower()
            messages.info(req, 'Password change successfully')
            return redirect("profile")
        else:
            messages.info(req, 'Password not change. You or signin with google OR You enterd ols password as wrong!!!')
            return redirect("profile")
    else:
        messages.info(req, 'Login required')
        return render(req,'login.html')

def changemobileno(req):
    if req.session['userEmail'] is not None:
        mobileno = req.POST['mobileno']
        db = Register.objects.get(email=req.session['userEmail'])
        if db.mobileno is not None:
            db.mobileno = mobileno
            db.save()
            red = req.session['userRole'].lower()
            messages.info(req, 'Mobile.no change successfully')
            return redirect("profile")
        else:
            messages.info(req, 'Mobile.no not change')
            return redirect("profile")
    else:
        messages.info(req, 'Login required')
        return render(req, 'login.html')

def adminedit(req, email):
    if req.session['userRole']== 'Admin':
        mobileno = req.POST['newmobileno']
        db = Register.objects.get(email=email)
        db.mobileno = mobileno
        db.save()
        print(email)
        messages.info(req, 'User detail edit successfully ')
        return redirect("userlist")
    else:
        messages.info(req, 'Login required')
        return redirect("login")


def delete(req, email):
    if req.session['userEmail'] is not None:
        db = Register.objects.get(email=email)
        db.status = False
        db.save()
        messages.info(req, 'User delete successfully ')
        return redirect("userlist")
    else:
        messages.info(req, 'Login required')
        return render(req, 'login.html')


def forgotpassword(req):
    if req.method == 'POST':
        email = req.POST['email']
        if Register.objects.filter(email=email).exists():
            unique_string = get_random_string(30, allowed_chars=string.ascii_uppercase + string.digits)
            link = config('DOMAIN_NAME')+"/resetpassword/" + unique_string
            db = Register.objects.get(email=email)
            db.forgot_password = unique_string
            db.save()
            # print(link)
            try:
                email = EmailMessage('Reset password', link, to=[email])
                threaademail = threading.Thread(target=emailthread, args=(email,))
                threaademail.start()
                # EmailMessageThread(email).start()
                # email.send()
                messages.info(req, 'Mail send successflly')
            except:
                messages.info(req, 'Please check your connection!!!')
        else:
            messages.info(req, 'This email not register yet')
        return redirect("forgotpassword")
    else:
        return render(req, 'forgotpassword.html')

def resetpassword(req, hash):
    if req.method == 'POST':
        password = make_password(req.POST['password'])
        db = Register.objects.get(forgot_password=hash)
        db.password = password
        # db.forgot_password = ' '
        db.save()
        messages.info(req, 'Password reset successfully')
        return redirect("login")
    else:
        try:
            db = Register.objects.get(forgot_password=hash)
            return render(req, 'resetpassword.html', {'email': db.email,'hash':hash})
        except:
            messages.info(req, 'Checck Your link')
            return redirect("login")