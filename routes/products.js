var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Product = require("../models/product");
var Cart = require("../models/cart");

var auth = require("../middlewares/auth");

var cartRouter = require("../routes/carts");

router.get("/:id/product-page", async function (req, res, next) {
  try {
    var product = await Product.findById(req.params.id);
    res.render("productPage", { product });
  } catch (error) {
    next(error);
  }
});

// Cart 

router.get("/:productId/cart/add", auth.checkLogin ,async function (req, res, next) {
  try {
    var productId = req.params.productId;
    var cart = await Cart.findOne({userId: req.user, product: productId});

    if(cart) {
      cart = await Cart.findByIdAndUpdate(cart.id, {$inc: {quantity: 1}});
    } else {
      var itemObj = {
        product: productId,
        userId: req.user,
        quantity: 1
      }
      cart = await Cart.create(itemObj);
      var user = await User.findByIdAndUpdate(req.user, {$push: {cartItems: cart.id}},{new:true});

      console.log(user);
      
    }
    res.redirect("/user/cart")
    
  } catch (error) {
    next(error);
  }
});


router.get("/:productId/cart/decrease-quantity", auth.checkLogin ,async function (req, res, next) {
  try {
    var productId = req.params.productId;
    var cart = await Cart.findOne({userId: req.user, product: productId});
    if(cart.quantity > 0) {
      cart = await Cart.findOneAndUpdate({userId: req.user, product: productId}, {$inc: {quantity: -1}}, {new: true});
    } else {
        cart = await Cart.findByIdAndDelete(cart.id);
    }

    console.log(cart);
    res.redirect("/user/cart");
  } catch (error) {
      next(error);
  }

});

router.post("/:productId/cart/update", auth.checkLogin, async function(req, res, next) {
  try {
    var productId = req.params.productId;
    if(req.body.quantity > 0) {
      var cart = await Cart.findOneAndUpdate({userId: req.user, product: productId}, req.body, {new: true});
    } else {
        var cart = await Cart.findOneAndDelete({userId: req.user, product: productId});
    }

    res.redirect("/user/cart");
  } catch (error) {
      next(error)
  }
})

module.exports = router;
