var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new Schema({

    title: {
        type: String,
        trim: true
    },

    description : {
        type: String,
        required: true,
        trim: true
    },

    user : {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    product : {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
},{timestamps: true});

module.exports = mongoose.model("Comment", commentSchema);


