var express = require("express");
var router = express.Router();

var User = require("../models/user");
var Product = require("../models/product");
var Comment = require("../models/comment");

var multer = require("multer");
var auth = require("../middlewares/auth");
var path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/uploads"));
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

router.get("/add-product", function (req, res, next) {
  res.render("addProduct");
});

router.post("/add-product", upload.single("image"), async function (
  req,
  res,
  next
) {
  try {
    req.body.image = req.file.filename;
    req.body.category = req.body.category.toLowerCase()
    var product = await Product.findOne({name: req.body.name});
    console.log("Req : ", req.body);
    console.log("Product", Product);
    if(!product) {
        product = await Product.create(req.body);
    } else {
        req.body.quantity = Number(product.quantity) + Number(req.body.quantity);
        product = await Product.findByIdAndUpdate(product.id, req.body);
    }
    res.redirect(`/product/${product.id}/product-page`);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/edit-product", upload.single("image"),async function(req, res, next) {
  try {
    var product = await Product.findById(req.params.id);
    res.render("editProduct",{product});
  } catch (error) {
    next(error);
  }
})

router.post("/:id/edit-product",upload.single("image"),async function(req, res, next) {
  try {
    if(req.file) {
      req.body.image = req.file.filename;
    }
    var product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.redirect(`/product/${product.id}/product-page`);
  } catch (error) {
    next(error);
  }
})

router.get("/:id/delete-product", async function(req, res, next) {
  try {
    
    var product = await Product.findByIdAndDelete(req.params.id);
    var deletedComment = await Comment.deleteMany({product: req.params.id});
    res.redirect("/");
  } catch (error) {
    next(error);
  }
})

// All users

router.get("/all-users", async function(req, res, next) {
  try {
    var allUsers = await User.find({});

    console.log(allUsers);
    
    res.render("allUsers", {allUsers});
  } catch (error) {
      next(error);
  }
})


// User Block-Unblock

router.get("/user/:userId/block", async function(req, res, next) {
  try {
    var userId = req.params.userId;
    var updatedUser = await User.findByIdAndUpdate(userId, {isBlocked: true});
    res.redirect("/admin/all-users");
  } catch (error) {
      next(error)
  }
});

router.get("/user/:userId/unblock", async function(req, res, next) {
  try {
    var userId = req.params.userId;
    var updatedUser = await User.findByIdAndUpdate(userId, {isBlocked: false});
    res.redirect("/admin/all-users");
  } catch (error) {
      next(error)
  }
})


module.exports = router;
