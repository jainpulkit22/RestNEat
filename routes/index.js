var express = require("express");
var router = express.Router({ mergeParams: true });
var User = require("../models/user");
var passport = require("passport");
var bcrypt = require("bcrypt");

router.get("/register", function (req, res) {
  res.render("register");
});

router.get("/", function (req, res) {
  res.render("landing");
});

// handling the sign up
router.post("/register", function (req, res) {
  const { username, password } = req.body;
  User.findOne({ username }).exec((err, user) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    if (user) {
      req.flash("error", "User already exists!");
      return res.redirect("/register");
    }
    bcrypt.hash(password, 10, function (err, hash) {
      const _user = new User({
        username,
        password: hash,
      });
      _user.save(function (err) {
        if (err) {
          req.flash("error", err.message);
          return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function () {
          res.redirect("/restaurants");
        });
      });
    });
  });
});

//handling the login page
router.get("/login", function (req, res) {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/restaurants",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

// logout logic
router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "You have successfuly logged out");
  res.redirect("/restaurants");
});

module.exports = router;
