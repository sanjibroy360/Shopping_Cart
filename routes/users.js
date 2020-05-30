var express = require("express");
let nodemailer = require("nodemailer");
let smtpTransport = require("nodemailer-smtp-transport");
var router = express.Router();

var userController = require('../controllers/userController');

// Models
var User = require("../models/user");

// Middlewares
var auth = require("../middlewares/auth");

/* User Sign Up */

router.get("/signup", userController.getSignUpPage);

router.post("/signup", userController.userSignUp);

/* User Login */ 

router.get("/login", userController.getLoginPage);

router.post("/login", userController.userLogin);


// Email Verify

router.get("/verify-email", userController.getVerifyEmailPage);

router.post("/verify-email", userController.verifyEmail);

router.get("/get-verfication-code", userController.getEmailVerificationCode);

// logout 

router.get("/logout", userController.userLogOut);

module.exports = router;
