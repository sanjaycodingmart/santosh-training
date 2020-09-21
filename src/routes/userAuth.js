//core module
const express = require("express");
const session = require("express-session");
const router = express.Router();
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const unique = require("unique-string");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
//local module
// const { users, userrole } = require("../models/database.js");
const validuser = require("../middleware/checkvalid");
// const { prisma } = require("../index");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const forgotPasswwordLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  handler: function(req, res) {
    res.json({
      message:
        "Too many request forget password from this IP, please try again",
    });
  },
});

const jwtKey = process.env.JWT_KEY; //my_secret_key

//signup
router.post("/signup", async (req, res, next) => {
  try {
    // console.log("signup");
    var dbEmail = await prisma.usertable.findOne({
      where: { email: req.body.email },
    });
    // console.log(dbEmail);
    if (dbEmail.email) {
      res.json({
        message: "Mail exists",
      });
    }
  } catch (e) {
    // console.log(req.body.name);
    // console.log(req.body.role);
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        return res.json({
          message: "error",
        });
      } else {
        var isRole = req.body.role;
        var pendingRequest = "true";
        var status = "pending";
        if (isRole == "User" || isRole == "Admin") {
          status = "accept";
          pendingRequest = "false";
        }
        try {
          if (isRole == "User" || isRole == "Seller" || isRole == "Admin") {
            console.log("..");
            var dbInsert = await prisma.usertable.create({
              data: {
                name: req.body.name,
                email: req.body.email,
                password: hash,
                // userrole: {
                //   create: [
                //     {
                //       role: req.body.role,
                //       pendingrequest: pendingRequest,
                //       status: status,
                //     },
                //   ],
                // },
              },
            });
            var dbUserRoleInsert = await prisma.userrole.create({
              data: {
                usertable: {
                  connect: { email: req.body.email },
                },
                role: req.body.role,
                pendingrequest: pendingRequest,
                status: status,
              },
            });
            res.json({
              message: "success",
            });
          } else {
            res.json({
              message: "Role mismatch",
            });
          }
        } catch (e) {
          console.log(e);
          res.json({
            message: "error",
          });
        }
      }
    });
  }
});

//login
router.post("/login", async (req, res, next) => {
  // console.log(req.body.email);
  // req.session.destroy();
  try {
    const dbUser = await prisma.usertable.findOne({
      where: { email: req.body.email },
      // attributes: ["email", "password", "name"],
      select: {
        email: true,
        password: true,
        name: true,
      },
    });
    // console.log(dbUser);
    const dbUserRole = await prisma.userrole.findOne({
      where: { email: req.body.email },
      // attributes: ["role", "pendingrequest", "status"],
      select: {
        role: true,
        pendingrequest: true,
        status: true,
      },
    });
    if (dbUser.email) {
      bcrypt.compare(req.body.password, dbUser.password, (err, result) => {
        if (err) {
          return res.json({
            message: "password mismatch",
          });
        }
        if (result) {
          if (
            dbUserRole.pendingrequest == "false" &&
            dbUserRole.status != "Reject" &&
            dbUserRole.status != "pending"
          ) {
            // var jwtEmail = dbUser.email;
            // var jwtName = dbUser.name;
            // var jwtRole = dbUserRole.role;
            // const token = jwt.sign({ jwtName, jwtEmail, jwtRole }, jwtKey, {
            //   algorithm: "HS256",
            // });
            req.session.name = dbUser.name;
            req.session.email = dbUser.email;
            req.session.role = dbUserRole.role;
            return res.json({
              message: "success",
              // token: token,
              role: dbUserRole.role,
              pendingrequest: dbUserRole.pendingrequest,
            });
          } else {
            return res.json({
              message: "Approvel pending",
              role: dbUserRole.role,
              pendingrequest: dbUserRole.pendingrequest,
              status: dbUserRole.status,
            });
          }
        }
        res.json({
          message: "Password not match",
        });
      });
    } else {
      res.json({
        message: "Mail not exists",
      });
    }
  } catch (e) {
    // console.log(e);
    res.json({
      message: "Mail not exists",
    });
  }
});

router.post("/logout", validuser, (req, res, next) => {
  req.session.destroy(function() {
    res.clearCookie("connect.sid");

    res.json({
      status: "success",
    });
  });
});

router.post("/forgotpassword", forgotPasswwordLimiter, async (req, res) => {
  try {
    var dbEmail = await prisma.usertable.findOne({
      where: { email: req.body.email },
      // attributes: ["email"],
      select: {
        email: true,
      },
    });
    if (dbEmail.email) {
      const uniqueString = unique();
      const forgot_password_update = await prisma.usertable.update({
        // {
        //   forgot_password: uniqueString,
        // },
        // {
        //   where: { email: req.body.email },
        // }
        data: { forgot_password: uniqueString },
        where: { email: req.body.email },
      });
      // console.log(uniqueString);
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.EMAIL_PASS,
        },
      });
      var mailOptions = {
        from: process.env.EMAIL_ID,
        to: req.body.email,
        subject: "Forgot password",
        text: "http://localhost:4200/password/change/" + uniqueString,
      };
      console.log(mailOptions.text);
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          res.json({
            message: "Try again",
          });
        } else {
          res.json({
            message: "link send your mail",
          });
        }
      });
    }
  } catch (error) {
    // console.log(error);
    res.json({
      message: "Mail not exits",
    });
  }
});

router.post("/updatepassword", async (req, res) => {
  try {
    var db = await peisma.usertable.findOne({
      where: { forgot_password: req.body.hashValue },
      // attributes: ["forgot_password"],
      select: {
        forgot_password: true,
      },
    });
    if (db.forgot_password) {
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          return res.json({
            message: "error",
          });
        } else {
          const dbPasswordUpdate = await prisma.usertable.update({
            // {
            //   password: hash,
            //   forgot_password: "",
            // },
            // {
            //   where: { forgot_password: req.body.hashValue },
            // }
            date: {
              password: hash,
              forgot_password: "",
            },
            where: { forgot_password: req.body.hashValue },
          });
          res.json({
            message: "password reseted",
          });
        }
      });
    }
  } catch (err) {
    res.json({
      message: "failed",
    });
  }
});

module.exports = {
  userAuth: router,
};
