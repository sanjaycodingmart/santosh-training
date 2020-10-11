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
const { users, userrole } = require("../models/database.js");
const validuser = require("../middleware/checkvalid");

const forgotPasswordLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  handler: function (req, res) {
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
    var dbEmail = await users.findOne({
      where: { email: req.body.email },
      attributes: ["email"],
    });
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
            var dbInsert = await users.create({
              name: req.body.name,
              email: req.body.email,
              password: hash,
            });
            var dbUserRoleInsert = await userrole.create({
              email: req.body.email,
              role: req.body.role,
              pendingrequest: pendingRequest,
              status: status,
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
    const dbUser = await users.findOne({
      where: { email: req.body.email },
      attributes: ["email", "password", "name"],
    });
    const dbUserRole = await userrole.findOne({
      where: { email: req.body.email },
      attributes: ["role", "pendingrequest", "status"],
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
  req.session.destroy(function () {
    res.clearCookie("connect.sid");

    res.json({
      status: "success",
    });
  });
});

router.post("/forgotpassword", forgotPasswordLimiter, async (req, res) => {
  try {
    var dbEmail = await users.findOne({
      where: { email: req.body.email },
      attributes: ["email"],
    });
    if (dbEmail.email) {
      const uniqueString = unique();
      await users.update(
        {
          forgot_password: uniqueString,
        },
        {
          where: { email: req.body.email },
        }
      );
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
        text: process.env.DOMAIN + "/password/update?id=" + uniqueString,
      };
      console.log(mailOptions.text);
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
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
    var db = await users.findOne({
      where: { forgot_password: req.body.hashValue },
      attributes: ["forgot_password"],
    });
    if (db.forgot_password) {
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          return res.json({
            message: "error",
          });
        } else {
          const dbPasswordUpdate = await users.update(
            {
              password: hash,
              forgot_password: "",
            },
            {
              where: { forgot_password: req.body.hashValue },
            }
          );
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
