var User = require("../models/user");
var Product = require("../models/product");
var passport = require("passport");
var Comment = require("../models/comment");

exports.checkLogin = async function (req, res, next) {
  try {
    if (req.session.userId || req.session.passport) {
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
    if (req.session.userId || req.session.passport) {
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

exports.sidebarCategories = async function(req, res, next) {
  try {
    var categories = await Product.distinct("category");
    
    if(categories.length) {
      res.locals.categories = categories;
    }
    
    next();
  } catch (error) {
      next(error); 
  }
}

exports.getCurrentUserInfo = async function (req, res, next) {
  try {
    if (req.session.userId  || req.session.passport) {
      var id = req.session.userId || req.session.passport.user;
      
      var user = await User.findById(id);
      if (user) {
        req.user = user.id;
        res.locals.user = {
          id: user.id,
          name: user.name,
          isAdmin: user.isAdmin,
          avatar: user.avatar
        };
      } 
    } else {
        res.locals.user = null;
    }
    next();
  } catch (error) {
    next(error);
  }
};

exports.countStars = async function(req, res, next) {
  try {
    var allProducts = await Comment.find({},"product ratings");
    
    var ratingObj = allProducts.reduce((acc, curerntProduct) => {
      var obj = {};
      
      var index = acc.findIndex(obj => obj.productId.toString() == curerntProduct.product.toString());
      
      if(index != -1) {
          
          acc[index].ratings += curerntProduct.ratings;
          acc[index].noOfPeople += 1;
        
      } else {
        obj = {
          productId : curerntProduct.product,
          ratings : curerntProduct.ratings,
          noOfPeople : 1
        }
        acc.push(obj);
      }
      return acc;
    },[]);

    req.ratingObj = ratingObj;
    next();
  } catch (error) {
      next(error);
  }
}
