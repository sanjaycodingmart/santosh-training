//core module
const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")

// const { users, userrole } = require("../models/database.js");
const roleCheck = require("../middleware/roleCheck");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/addadmin",roleCheck("Admin"), async (req, res, next) => {
    try {
      var dbEmail = await prisma.usertable.findOne({
        where: { email: req.body.email },
        // attributes: ["email"],
        select: {
          email : true,
        }
      });
      if (dbEmail.email) {
        res.json({
          message: "Mail exists",
        });
      }
    } catch (e) {
          status = "pending";
          pendingRequest = "false";
          var mykey = crypto.createCipher('aes-128-cbc',process.env.JWT_KEY);
          var mystr = mykey.update(req.body.email,'utf8','hex');
          mystr+=mykey.final('hex');
              var dbInsert = await prisma.usertable.create({
                name: "Not specified",
                email: req.body.email,
                password: "Not specified",
              });
              var dbUserRoleInsert = await prisma.userrole.create({
                email: req.body.email,
                role: "Admin",
                pendingrequest: pendingRequest,
                status: status,
              });
              var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: process.env.EMAIL_ID,
                    pass: process.env.EMAIL_PASS
                  }
                });

                var mailOptions = {
                  from: process.env.EMAIL_ID,
                  to: req.body.email,
                  subject: 'Inviting Admin',
                  text: "http://localhost:4200/admin/invite/"+mystr
                };
                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    res.json({
                      message : "mail not send Try again"
                    })
                  } else {
                    res.json({
                       message: "mail sent",
                     });
                  }
                });
        }
});

router.post("/invitecheck",async(req,res)=>{
  try{
    var mykey = crypto.createDecipher('aes-128-cbc',process.env.JWT_KEY);
    var mystr = mykey.update(req.body.hash,'hex','utf8');
    mystr+=mykey.final('utf8');
    console.log(mystr);
    res.json({
      status : "success",
      email : mystr
    });

  }catch(err){
    res.json({
      status : "failed"
    })
  }

});

router.post("/inviteaccept",async(req,res)=>{
    const status ="Accept";
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if(err){
        res.json({
          status : "Try Again"
        })
      }
      else{
        const update_admin_info = prisma.usertable.update({
          // {
          //  name : req.body.name,
          //  password:hash
          // },
          // { where: { email: req.body.email } }
          data: {
            name: req.body.name,
            password: hash,
          },
          where: { email: req.body.email },
        });

        const update_status = userrole.update({
          // {
          //  status : status
          // },
          // { where: { email: req.body.email } }
          data: {
            status: status,
          },
          where: { email: req.body.email },
        });
    res.json({
      status : "success"
    });
      }
    });

});


module.exports = {
  addAdmin: router,
};
