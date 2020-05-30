var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    image: String,

    price: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },

    description : {
        type: String,
        required: true
    },

    ratedBy: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref:"User"
        },

        stars: {
            type: Number,
            min: 0,
            default: 0
        }
    }],

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
        min: 0,
        default: 0,
        required: true
    }

}, {timestamps: true});

module.exports = mongoose.model("Product",productSchema);