var express = require("express");
var router = express.Router();

var User = require("../models/user");
var Product = require("../models/product");
var multer = require("multer");
var auth = require("../middlewares/auth");
var path = require("path");


var storage = multer.diskStorage({
  
    destination: function(req, file, cb) {
      cb(null,path.join(__dirname,"../public/images/uploads"));
      
    },
  
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
var upload = multer({storage: storage});



router.get("/add-product", function(req, res, next) {
    res.render("addProduct");
})

router.post("/add-product",upload.single("image"), function(req, res, next) {
    console.log("File: ",req.file);
    console.log("Req. Body: ", req.body);
    res.send(path.join(__dirname,"/public/images/uploads"));
})


module.exports = router;