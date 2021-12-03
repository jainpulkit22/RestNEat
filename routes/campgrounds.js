var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var middleware = require("../middleware");
var formidable = require("formidable");
var cloudinary = require("cloudinary").v2;
var fs = require("fs");
const path = require("path");

router.get("", function (req, res) {
  //res.render("home", {camp: campgrounds})
  Campground.find({}, function (err, camps) {
    if (err) console.log("Something WentWrong!");
    else res.render("campgrounds/home", { camp: camps });
  });
});
router.get("/new", middleware.isLoggedIn, middleware.checkAdmin, function (req, res) {
  res.render("campgrounds/search");
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
  Campground.create(
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
      else res.redirect("/campgrounds/");
    }
  );
  //res.redirect("/campgrounds/new")
});
router.get("/:id", function (req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function (err, result) {
      if (err) req.flash("error", err.message);
      else res.render("campgrounds/show", { campground: result });
    });
});

//EDIT CAMPGROUND ROUTE
router.get(
  "/:id/edit",
  middleware.checkCampgroundOwnership,
  function (req, res) {
    Campground.findById(req.params.id, function (err, result) {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        res.render("campgrounds/edit", { campground: result });
      }
    });
  }
);
//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    function (err, updatedCampground) {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// Search a Restaurant
router.post("/findCampground", function(req, res){
  var name = req.body.search;

  Campground.findOne({name: name}, function(err, result){
    if(err){
      req.flash("error", "Campground not found!");
    }
    else{
      res.render("campgrounds/show", {campground: result})
    }
  })  
})

// UPLOAD MENU
router.post(
  "/:id/uploadmenu",
  middleware.checkCampgroundOwnership,
  function (req, res) {
    var form = new formidable.IncomingForm({
      uploadDir: path.join(__dirname + "/../uploads"),
    });
    form.parse(req, function (err, fields, files) {
      cloudinary.uploader.upload(files.pdfinput.path, function (err, result) {
        fs.unlink(files.pdfinput.path, function (err) {
          if (err) throw err;
        });
        Campground.findById(req.params.id, function (err, campg) {
          console.log(campg, result.url);
          campg.menu = result.url;
          campg.save(function (err, cg) {});
        });
      });
    });
    res.redirect("/campgrounds");
  }
);

module.exports = router;
