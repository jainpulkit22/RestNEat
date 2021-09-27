var express = require("express");
var router = express.Router({mergeParams: true});
var User = require("../models/user");
var passport = require("passport");

router.get("/register", function(req,res){
    res.render("register")
})

router.get("/", function(req, res){
    res.redirect("/campgrounds")
})

// handling the sign up 
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err)
        {
            req.flash("error", err.message)
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to yelpcamp" + req.body.username)
            res.redirect("/campgrounds");
        })
    })
})

//handling the login page
router.get("/login", function(req, res){
    res.render("login");
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
})

// logout logic 
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have successfuly logged out")
    res.redirect("/campgrounds");
})

module.exports = router;