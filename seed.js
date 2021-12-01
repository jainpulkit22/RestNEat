var mongoose = require("mongoose")
var Restaurants  = require("./models/restaurant")
var Comment = require("./models/comment")
var data = [{
    name: "Dharamshala",
    img: "https://img.traveltriangle.com/blog/wp-content/uploads/2019/11/Homestays-In-Dharamshala-cover_19th-Nov.jpg",
    description: "Very beautiful place to visit"
}]
function seedDB(){
    Restaurants.remove({}, function(err){
        if(err)
            console.log(error)
        else
            console.log("Restaurants removed")
        /*data.forEach(function(seed){
            Restaurants.create(seed, function(err, res){
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