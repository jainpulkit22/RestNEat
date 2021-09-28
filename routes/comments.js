var express = require("express")
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var oldRating = 0

router.get("/new", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, result){
        if(err)
            console.log(err);
        else
            res.render("comments/new", {campground: result})
    })
})
router.post("", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err)
        {
            console.log(err)
            res.redirect("/campgrounds")
        }
        else{
            Comment.create(req.body.comment, function(err,comment){
                if(err)
                    console.log(err)
                else
                {
                    //console.log(comment)
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment)
                    var r1 = campground.rating
                    var r2 = campground.totalReviews
                    campground.rating = (r1*r2 + comment.rating)/(r2+1)
                    campground.totalReviews = r2+1; 
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
})

// EDIT COMMENT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            console.log()
            oldRating = foundComment.rating
            res.render("comments/edit", {campgroundId: req.params.id, comment: foundComment})
        }
    })
})

// UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updated){
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            Campground.findById(req.params.id, function(error, camp){
                if(error){
                    console.log("Ivalid operation")
                }
                else
                {
                    var r1 = camp.rating
                    var r2 = camp.totalReviews
                    camp.rating = (r1*r2-oldRating+updated.rating)/r2
                    camp.save()
                }
            })
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

// DELETE COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, comm){
        if(err)
        {
            res.redirect("back")
        }
        else
        {
            oldRating = comm.rating
        }
    })
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err)
        {
            res.redirect("back")
        }
        else
        {
            Campground.findById(req.params.id, function(error, camp){
                if(error){
                    console.log("Ivalid operation")
                }
                else
                {
                    var r1 = camp.rating
                    var r2 = camp.totalReviews
                    camp.rating = (r1*r2-oldRating)/(r2-1)
                    camp.totalReviews = r2-1
                    camp.save()
                }
            })
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

module.exports = router;