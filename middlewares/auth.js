var User = require("../models/user");
var passport = require("passport");

exports.checkLogin = async function (req, res, next) {
  try {
    if (req.session.userId || req.session.passport.user) {
      var user = await User.findById(req.user);
      if(user) {
        if (user.isVerified) {
          next();
        } else {
          res.redirect("/users/get-verfication-code");
        }
      } else {
        res.redirect("/users/signup");
      }
    } else {
      res.redirect("/users/login");
    }
  } catch (error) {
    next(error);
  }
};

exports.checkAdmin = async function (req, res, next) {
  try {
    if (req.session.userId || req.session.passport.user) {
      var user = await User.findById(req.user);
      if (user.isVerified) {
        if(user.isAdmin) {
          next();
        } else {
          res.redirect("/");
        }
      } else {
        res.redirect("/users/get-verfication-code");
      }
    } else {
      res.redirect("/users/login");
    }
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUserInfo = async function (req, res, next) {
  try {
    if (req.session.userId  || req.session.passport) {
      var id = req.session.userId || req.session.passport.user;

      var user = await User.findById(id);
      console.log("USER: ", user);
      if (user) {
        req.user = user.id;
        res.locals.user = {
          id: user.id,
          name: user.name,
          isAdmin: user.isAdmin,
        };
        console.log("LOCAL: ", res.locals);
        console.log("Local Session: ",req.session);
      } 
    } 
    next();
  } catch (error) {
    next(error);
  }
};
