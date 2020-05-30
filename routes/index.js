var express = require("express");
var router = express.Router();
var passport = require("passport");

/* GET home page. */
router.get("/", function (req, res, next) {

  if(!req.hasOwnProperty("user")) {
    res.locals.user = false
  }
  res.render("index", { title: "Express" });
});

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login','email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: "/users/login" }),
  function (req, res) {
    
    res.redirect("/users/get-verfication-code");
  }
);

module.exports = router;
