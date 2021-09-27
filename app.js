var express = require("express")
var app = express()
var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended: true}))
const dotenv =  require('dotenv') 
dotenv.config()
var mongoose = require("mongoose")
mongoose.connect(process.env.mongoURL)
app.set("view engine","ejs")
app.use(express.static(__dirname + "/public"))
var Campground = require("./models/campground")
var Comment = require("./models/comment")
var User = require("./models/user")
var passport = require("passport");
var LocalStrategy = require("passport-local")
var seedDB = require("./seed")
var methodOverride = require("method-override")
var flash = require("connect-flash")

//seedDB()


var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")


// PASSPORT CONFIGURATION   
app.use(require("express-session")({
    secret: "Yelpcamp is my bootcamp",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(methodOverride("_method"))
app.use(flash())
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.listen(process.env.PORT||3000, function(){
    console.log("YelpCamp has started")
})