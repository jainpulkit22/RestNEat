var express = require("express")
var router = express.Router({mergeParams: true});
var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var oldRating = 0

router.get("/new", middleware.isLoggedIn, function(req,res){
    Restaurant.findById(req.params.id, function(err, result){
        if(err)
            console.log(err);
        else
            res.render("comments/new", {restaurant: result})
    })
})
router.post("", middleware.isLoggedIn, function(req,res){
    Restaurant.findById(req.params.id, function(err, restaurant){
        if(err)
        {
            console.log(err)
            res.redirect("/restaurants")
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
                    restaurant.comments.push(comment)
                    var r1 = restaurant.rating
                    var r2 = restaurant.totalReviews
                    restaurant.rating = (r1*r2 + comment.rating)/(r2+1)
                    restaurant.totalReviews = r2+1; 
                    restaurant.save();
                    res.redirect("/restaurants/" + restaurant._id)
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
            res.render("comments/edit", {restaurantId: req.params.id, comment: foundComment})
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
            Restaurant.findById(req.params.id, function(error, camp){
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
            res.redirect("/restaurants/" + req.params.id)
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
            Restaurant.findById(req.params.id, function(error, camp){
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
            res.redirect("/restaurants/" + req.params.id)
        }
    })
})

module.exports = router;