var express = require("express");
var router = express.Router({ mergeParams: true });
var Restaurant = require("../models/restaurant");
var middleware = require("../middleware");
var formidable = require("formidable");
var cloudinary = require("cloudinary").v2;
var fs = require("fs");
const path = require("path");

router.get("", function (req, res) {
  //res.render("home", {camp: restaurants})
  Restaurant.find({}, function (err, camps) {
    if (err) console.log("Something WentWrong!");
    else res.render("restaurants/home", { camp: camps });
  });
});
router.get("/new", middleware.isLoggedIn, middleware.checkAdmin, function (req, res) {
  res.render("restaurants/search");
});
router.post("", middleware.isLoggedIn,middleware.checkAdmin, function (req, res) {
  var res1 = req.body.search;
  var res2 = req.body.link;
  var res3 = req.body.desc;
  var res4 = req.body.price;
  var res5 = req.body.map_location;
  var res6 = req.body.contact;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  //console.log(res1)
  Restaurant.create(
    {
      name: res1,
      img: res2,
      description: res3,
      totalReviews: 0,
      rating: 3,
      author: author,
      price: res4,
      map_location: res5,
      contact: res6,
    },
    function (err, result) {
      if (err) req.flash("error", err.message);
      else res.redirect("/restaurants/");
    }
  );
  //res.redirect("/restaurants/new")
});
router.get("/:id", function (req, res) {
  Restaurant.findById(req.params.id)
    .populate("comments")
    .exec(function (err, result) {
      if (err || !result){
        req.flash("error", err.message);
        res.redirect('/restaurants');
      } 
      else res.render("restaurants/show", { restaurant: result });
    });
});

//EDIT restaurant ROUTE
router.get(
  "/:id/edit",
  middleware.checkRestaurantOwnership,
  function (req, res) {
    Restaurant.findById(req.params.id, function (err, result) {
      if (err) {
        res.redirect("/restaurants");
      } else {
        res.render("restaurants/edit", { restaurant: result });
      }
    });
  }
);
//UPDATE restaurant ROUTE
router.put("/:id", middleware.checkRestaurantOwnership, function (req, res) {
  Restaurant.findByIdAndUpdate(
    req.params.id,
    req.body.restaurant,
    function (err, updatedRestaurant) {
      if (err) {
        res.redirect("/restaurants");
      } else {
        res.redirect("/restaurants/" + req.params.id);
      }
    }
  );
});

// DESTROY restaurant ROUTE
router.delete("/:id", middleware.checkRestaurantOwnership, function (req, res) {
  Restaurant.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/restaurants");
    } else {
      res.redirect("/restaurants");
    }
  });
});

// Search a Restaurant
router.post("/findRestaurant", function(req, res){
  var name = req.body.search;

  Restaurant.findOne({name: name}, function(err, result){
    if(err || !result){
      req.flash("error", "Restaurant not found!");
      res.redirect("/restaurants")
    }
    else{
      res.redirect("/restaurants/"+result._id)
    }
  })  
})

// UPLOAD MENU
router.post(
  "/:id/uploadmenu",
  middleware.checkRestaurantOwnership,
  function (req, res) {
    var form = new formidable.IncomingForm({
      uploadDir: path.join(__dirname + "/../uploads"),
    });
    form.parse(req, function (err, fields, files) {
      cloudinary.uploader.upload(files.pdfinput.path, function (err, result) {
        fs.unlink(files.pdfinput.path, function (err) {
          if (err) throw err;
        });
        Restaurant.findById(req.params.id, function (err, campg) {
          console.log(campg, result.url);
          campg.menu = result.url;
          campg.save(function (err, cg) {});
        });
      });
    });
    res.redirect("/restaurants");
  }
);

module.exports = router;
