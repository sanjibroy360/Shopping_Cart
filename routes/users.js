var express = require("express");
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
