var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("", function(req,res){
    //res.render("home", {camp: campgrounds})
    Campground.find({}, function(err, camps){
        if(err)
            console.log("Something WentWrong!")
        else
            res.render("campgrounds/home", {camp: camps})
    })
})
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/search")
})
router.post("", middleware.isLoggedIn, function(req,res){
    var res1 = req.body.search;
    var res2 = req.body.link;
    var res3 = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    //console.log(res1)
    Campground.create({
        name: res1,
        img: res2,
        description: res3,
        author: author
    }, function(err, result){
        if(err)
            req.flash("error", err.message)
        else
            res.redirect("/campgrounds/new")
    })
    //res.redirect("/campgrounds/new")
})
router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, result){
        if(err)
            req.flash("error", err.message)
        else
            res.render("campgrounds/show", {campground: result})
    })
})

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, result){
        if(err)
        {
            res.redirect("/campgrounds")
        }
        else
        {
            res.render("campgrounds/edit", {campground: result})
        }
    })
})
//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err)
        {
            res.redirect("/campgrounds")
        }
        else
        {
            res.redirect("/campgrounds" + req.params.id)
        }
    })
})

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err)
        {
            res.redirect("/campgrounds")
        }
        else{
            res.redirect("/campgrounds")
        }
    })
})


module.exports = router;