var express = require("express");
var router = express.Router();

var User = require("../models/user");
var Product = require("../models/product");
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
    var product = await Product.findOne({name: req.body.name});
    console.log("Req : ", req.body);
    console.log("Product", Product);
    if(!product) {
        product = await Product.create(req.body);
    } else {
        req.body.quantity = Number(product.quantity) + Number(req.body.quantity);
        product = await Product.findByIdAndUpdate(product.id, req.body);
    }
    res.redirect(`/admin/${product.id}/product-page`);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/product-page", async function (req, res, next) {
  try {
    var product = await Product.findById(req.params.id);
    res.render("productPage", {product});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
