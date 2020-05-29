var express = require("express");
let nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
var router = express.Router();

// Models
var User = require("../models/user");

// Middlewares
var auth = require('../middlewares/auth');

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", async function (req, res, next) {
  try {

    let transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.PASSWORD,
      },
    }));
  
    var verification = Math.random().toString(36).slice(-5);
  
    let mailOptions = {
      from: process.env.GMAIL_ID,
      to: req.body.email,
      subject: "This is a test mail.",
      test: "First mail via nodemailer",
      html: `<h1>From nodemailer</h1> ${verification}`,
    };
  
    req.verification = verification;
  
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return console.log("ERROR:  ",err);
      console.log("Message sent: %", info.response);
    });
  
    






    // My Previous Code

    var user = await User.create(req.body);
    req.session.userId = user.id
    res.json({
      success: true,
      msg: "User Created Successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      msg: "Error in user creation",
      error,
    });
  }
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.post("/login", async function (req, res, next) {
  try {
    var user = await User.findOne({ email: req.body.email });

    if (user) {
      if (await user.checkPassword(req.body.password)) {
        
        console.log("Session: ", req.session);
        console.log("Req. User: ", req.user);
        console.log("Res. User: ",res.locals.user);
        
        res.json({
          success: true,
          msg: "User Logged in successfully",
        });

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
    res.json({
      success: false,
      error,
    });
  }
});




module.exports = router;
