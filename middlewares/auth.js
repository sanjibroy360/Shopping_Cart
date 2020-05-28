var User = require("../models/user");
var passport = require('passport');

exports.checkLogin = function (req, res, next) {
  if (require.session.userId || req.session.passport.user.userId) {
    console.log("User Logged in");
    next();
  } else {
    res.redirect("login");
  }
};

exports.getCurrentUserInfo = async function (req, res, next) {
  try {
    var id = req.session.userId;
    var user = await User.findById(id);
    if (user) {
      req.user = user.id;
      res.locals.user = user.id;
    }
    next();
  } catch (error) {
    next(error);
  }
};
