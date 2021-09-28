var mongoose = require("mongoose")
var commschema = new mongoose.Schema({
    text: String,
    rating: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
},{
    timestamps: true
})
module.exports = mongoose.model("Comment", commschema)