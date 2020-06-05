var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Product = require("../models/product");
var Cart = require("../models/cart");
var Comment = require("../models/comment");

var auth = require("../middlewares/auth");

var cartRouter = require("../routes/carts");

router.get("/:id/product-page", auth.countStars ,async function (req, res, next) {
  try {
    var ratingObj = req.ratingObj;
    var product = await Product.findById(req.params.id)
                               .populate({
                                 path: "comments",
                                 populate: {
                                   path: "user",
                                   model: "User"
                                 }
                               })
    var isAlreadyReviewed = await Comment.findOne({user : req.user, product : req.params.id});
                              
    index = ratingObj.findIndex(obj => obj.productId.toString() == req.params.id.toString());
    var avgRating = 0;
    
    if(index != -1) {
      avgRating = (ratingObj[index].ratings) / (ratingObj[index].noOfPeople);
      
      res.render("productPage", { product, isAlreadyReviewed, avgRating: avgRating, noOfPeople: ratingObj[index].noOfPeople});
    } else {

      res.render("productPage", { product, isAlreadyReviewed, avgRating: 0, noOfPeople: 0});
    }
      
  } catch (error) {
    next(error);
  }
});

router.get("/filter", async function(req, res, next){
  try {
    
   if(!req.session.filtered && req.filtered !== req.query.category) {
    req.session.filtered = req.query.category;
    var filter = req.query;
    var filteredProduct = await Product.find(filter);

    res.render("index", {allProducts: filteredProduct})
   } else {
      res.redirect("/");
   }
  } catch (error) {
      next(error);
  }
})

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
    
    console.log("dec-cart: ",cart.quantity);

    if(cart.quantity > 1) {
      cart = await Cart.findOneAndUpdate({userId: req.user, product: productId},{$inc: {quantity: -1}}, {new: true}); 
    } else {
        cart = await Cart.findByIdAndDelete(cart.id);
        var updatedUser = await User.findByIdAndUpdate(req.user, {$pull: {cartItems: cart.id}},{new: true});

        console.log("updatedUser", updatedUser);
    }

    
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

        var updatedUser = await User.findByIdAndUpdate(req.user, {$pull: {cartItems: cart.id}},{new: true});
    }

    res.redirect("/user/cart");
  } catch (error) {
      next(error)
  }
})


router.get('/:productId/cart/remove', auth.checkLogin, async function(req, res, next) {
  try {
   
    var productId = req.params.productId;
    var cart = await Cart.findOneAndDelete({userId : req.user, product: productId});

    var updatedUser = await User.findByIdAndUpdate(req.user, {$pull: {cartItems: cart.id}},{new: true});

    res.redirect("/user/cart");
  } catch (error) {
      next(error)
  }
})


// Comments

router.get("/:productId/comment/add", auth.checkLogin, function(req, res, next) {
  res.render("addComment", {productId: req.params.productId});
})

router.post("/:productId/comment/add", auth.checkLogin, async function(req, res, next) {
  try {
    req.body.user = req.user;
    req.body.product = req.params.productId;
    req.body.ratings = +req.body.ratings;    
    var ratings = +req.body.ratings;

    var comment = await Comment.create(req.body);
    var updatedProduct = await Product.findByIdAndUpdate(req.params.productId, {$set:{$inc: {totalStars: +ratings}}, $push: { comments: comment.id }},{new: true});

    
    res.redirect(`/product/${req.params.productId}/product-page`);
  } catch (error) {
      next(error);
  }
})


router.get("/:productId/comment/:commentId/edit", auth.checkLogin, async function(req, res, next) {
  try {
    var commentId = req.params.commentId;
    var comment = await Comment.findById(commentId);
    res.render("editComment",{comment});
  } catch (error) {
      next(error);
  }
});


router.post("/:productId/comment/:commentId/edit", auth.checkLogin, async function(req, res, next) {
  try {
    var commentId = req.params.commentId;

    var comment = await Comment.findByIdAndUpdate(commentId, req.body, {new: true});
    
    res.redirect(`/product/${req.params.productId}/product-page`);

  } catch (error) {
      next(error);
  }
});

router.get("/:productId/comment/:commentId/delete", auth.checkLogin, async function(req, res, next) {
  try {
    var commentId = req.params.commentId;
    var productId = req.params.productId;
    var comment = await Comment.findByIdAndDelete(commentId);
    console.log("Product Id: ",productId);
    var ratings = comment.ratings;

    var updatedProduct = await Product.findByIdAndUpdate(productId, {$set:{$inc: {totalStars: -ratings}}, $pull: { comments: comment.id }},{new: true});

    res.redirect(`/product/${productId}/product-page`);

  } catch (error) {
      next(error);
  }
});

module.exports = router;
