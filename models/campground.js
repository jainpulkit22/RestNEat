var mongoose = require("mongoose")
var campSchema = new mongoose.Schema({
    name: String,
    img: String,
    description: String,
    price: Number,
    map_location: String,
    totalReviews: Number,
    rating: Number,
    contact: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Campground", campSchema)