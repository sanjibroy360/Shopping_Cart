var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Product = require("../models/product");

/* GET home page. */
router.get("/", async function (req, res, next) {
  
  try {
    req.session.filtered = null;
    if(!req.hasOwnProperty("user")) {
      res.locals.user = false;
    }
    var allProducts = await Product.find({});
    res.render("index", {allProducts});
  } catch (error) {
      next(error); 
  }
});

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login','email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: "/users/login" }),
  async function (req, res, next) {
    try {
      console.log("Passport Session: ", req.session);
      var user = await User.findById(req.session.passport.user);
      if(user.isVerified) {
        res.redirect("/")
      } else {
        res.redirect("/users/get-verfication-code");
      }
      
    } catch (error) {
      next(error);
    }
    
  }
);

module.exports = router;
