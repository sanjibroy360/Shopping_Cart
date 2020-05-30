var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name : {
        type: String,
        required: true,
    },

    description : {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],

    quantity: {
        type: Number,
        required: true
    }

}, {timestamps: true});

module.exports = mongoose.model("Product",productSchema);