var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Product = require("../models/product");
var Cart = require("../models/cart");

var auth = require("../middlewares/auth");

router.get("/", auth.checkLogin, async function (req, res, next) {
  try {
    var allCartProducts = await Cart.find({ userId: req.user }).populate(
      "product",
      "-createdAt -updatedAt -description"
    );
    console.log("All Products",allCartProducts);
    res.render("cartPage", { allCartProducts });
    
  } catch (error) {
    next(error);
  }
});

module.exports = router;
