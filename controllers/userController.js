var express = require("express");
var mongoose = require("mongoose");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

var User = require("../models/user");

exports.getSignUpPage = (req, res, next) => {
  res.render("signup");
};

exports.userSignUp = async function (req, res, next) {
  try {
    var user = await User.create(req.body);
    req.session.userId = user.id;
    console.log({
      success: true,
      msg: "User Created Successfully",
    });

    res.redirect("/users/get-verfication-code");
  } catch (error) {
    res.json({
      success: false,
      msg: "Error in user creation",
      error,
    });
  }
};

exports.getLoginPage = function (req, res, next) {
  res.render("login");
};

exports.userLogin = async function (req, res, next) {
  try {
    var user = await User.findOne({ email: req.body.email });
    console.log("Login User: ", user);
    if (user && !user.isBlocked) {
      if (await user.checkPassword(req.body.password)) {
        req.session.userId = user.id;
        res.redirect("/");
      } else {
        res.json({
          success: false,
          msg: "Wrong Password!",
        });
      }
    } else {
      res.json({
        success: false,
        msg: "Wrong Email",
      });
    }
  } catch (error) {
      next(error);
  }
};

exports.userLogOut = function (req, res, next) {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/users/login");
};

exports.getVerifyEmailPage = async function (req, res, next) {
  try {
    console.log("Verficaton Code", req.session.verificationCode);
    var user = await User.findById(req.user);
    var passport = !Boolean(user.password);

    res.render("emailVerify", { passport });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async function (req, res, next) {
  try {
    if (req.session.verificationCode == req.body.otp) {
      if (
        req.body.confirmPassword &&
        req.body.password == req.body.confirmPassword
      ) {
        var user = await User.findById(req.user);
        password = await user.encryptPassword(req.body.password);
        var user = await User.findByIdAndUpdate(req.user, {
          isVerified: true,
          password,
        });

        res.redirect("/");
      } else {
        var user = await User.findByIdAndUpdate(req.user, { isVerified: true });
        res.redirect("/");
      }
    } else {
      await User.findByIdAndDelete(req.user);
      delete req.user;
      res.locals.user = false;
      delete req.session.verificationCode;
      res.redirect("/users/signup");
    }
    delete req.session.verificationCode;
  } catch (error) {
    next(error);
  }
};

exports.getEmailVerificationCode = async function (req, res, next) {
  try {
    var user = await User.findById(req.user);
    var transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_ID,
          pass: process.env.PASSWORD,
        },
      })
    );

    var verificationCode = Math.random().toString(36).slice(-5);

    let mailOptions = {
      from: process.env.GMAIL_ID,
      to: user.email,
      subject: "This is a test mail.",
      test: "First mail via nodemailer",
      html: `<h1>Your OTP is</h1> <h3>${verificationCode}</h3>`,
    };

    req.session.verificationCode = verificationCode;

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return console.log("ERROR:  ", err);
      console.log("Message sent: %", info.response);
    });

    res.redirect("/users/verify-email");
  } catch (error) {
    next(error);
  }
};
