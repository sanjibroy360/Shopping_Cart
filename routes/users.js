var express = require("express");
let nodemailer = require("nodemailer");
let smtpTransport = require("nodemailer-smtp-transport");
var router = express.Router();
var multer = require("multer");
var path = require('path');
var fs = require('fs');

var userController = require('../controllers/userController');

// Models
var User = require("../models/user");

// Middlewares
var auth = require("../middlewares/auth");

// Multer

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log("Path: ",path.join(__dirname, "../public/images/uploads/profile_pictures"));
      cb(null, path.join(__dirname, "../public/images/uploads/profile_pictures"));
    },
  
    filename: function (req, file, cb) {
      cb(
        null,
        "user" + Math.floor(Math.random() * (1111 - 9999) + 1111) + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  var upload = multer({ storage: storage });
  

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

// Profile

router.get("/:userId/profile", async function(req, res, next) {
    try {
        var user = await User.findById(req.user);
        res.render("userProfile",{user})
    } catch (error) {
        next(error);  
    }
})

/* Update User */

router.get("/:userId/profile/edit", async function(req, res, next) {
    try {
        var user = await User.findById(req.user);
        res.render("editUserProfile",{user})
    } catch (error) {
        next(error);  
    }
});

router.post("/:userId/profile/edit", upload.single("avatar"), async function(req, res, next) {
    try {
        if(req.file) {
            req.body.avatar = req.file.filename;
        }

        var updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, {runValidators: true});

        if(req.file && updatedUser.avatar != req.file.filename) {
            var imgPath = path.join(__dirname, "../public/images/uploads/profile_pictures/");
            var deletedImage = fs.unlink(imgPath+updatedUser.avatar, (err) => {
            next(err);
    });
        }

        res.redirect(`/users/${req.params.userId}/profile`);
    } catch (error) {
        next(error);
    }
})



module.exports = router;
