var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    company: {
        type: String,
        default: "",
        trim: true,
        lowercase: true
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
        required: true,
        trim: true
    },


    category: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    quantity: {
        type: Number,
        min: 0,
        default: 0,
        required: true
    },

    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],


}, {timestamps: true});

module.exports = mongoose.model("Product",productSchema);