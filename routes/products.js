var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Product = require("../models/product");
var Cart = require("../models/cart");
var Comment = require("../models/comment");

var productController = require('../controllers/productController');

var auth = require("../middlewares/auth");

var cartRouter = require("../routes/carts");

router.get("/:id/product-page", auth.countStars, productController.productDetailsPage);

router.get("/filter", productController.filterProduct)

// Cart 

router.get("/:productId/cart/add", auth.checkLogin ,productController.addToCart);


router.get("/:productId/cart/decrease-quantity", auth.checkLogin, productController.decreaseCartQuantityByOne);

router.post("/:productId/cart/update", auth.checkLogin, productController.updateCartQuantity)


router.get('/:productId/cart/remove', auth.checkLogin, productController.removeCartItem)


// Comments

router.get("/:productId/comment/add", auth.checkLogin, productController.getAddCommentPage)

router.post("/:productId/comment/add", auth.checkLogin, productController.createComment)


router.get("/:productId/comment/:commentId/edit", auth.checkLogin, productController.getEditCommentPage);


router.post("/:productId/comment/:commentId/edit", auth.checkLogin, productController.EditComment);

router.get("/:productId/comment/:commentId/delete", auth.checkLogin, productController.deleteComment);

module.exports = router;
