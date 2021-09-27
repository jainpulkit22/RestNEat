var mongoose = require("mongoose")
var Campgrounds  = require("./models/campground")
var Comment = require("./models/comment")
var data = [{
    name: "Dharamshala",
    img: "https://img.traveltriangle.com/blog/wp-content/uploads/2019/11/Homestays-In-Dharamshala-cover_19th-Nov.jpg",
    description: "Very beautiful place to visit"
}]
function seedDB(){
    Campgrounds.remove({}, function(err){
        if(err)
            console.log(error)
        else
            console.log("Campgrounds removed")
        /*data.forEach(function(seed){
            Campgrounds.create(seed, function(err, res){
                if(err)
                    console.log(err)
                else{
                    Comment.create({
                        text: "IPL",
                        author: "Sachin Tendulkar"
                    }, function(err, comm){
                        if(err)
                            console.log(err)
                        else
                        {
                            res.comments.push(comm);
                            res.save();
                            console.log(res)
                        }
                    })
                }
            })
        })*/
    })
}
module.exports = seedDB