var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var {hash, compare} = require('bcrypt');

var userSchema = new Schema({
    name : {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        maxlength: 20,
    },

    isAdmin : {
        type: Boolean,
        default: false
    },

    isBlocked : {
        type: Boolean,
        default: false
    },

    favorited : {
        type: Schema.Types.ObjectId,
        ref: "Product",
        default: ''
    }
},{timestamps: true});

userSchema.pre("save", async function(next) {
    try {
        this.password = await hash(this.password, 10);
        if(this.email == "sanjibroy32124@gmail.com") {
            this.isAdmin = true;
        }
        next()
    } catch (error) {
        res.json({
            success: false,
            msg: "Error in password hashing",
            error
        })   
    }
});

userSchema.methods.checkPassword = async function(password) {
    return await compare(password, this.password);
}

module.exports = mongoose.model("User",userSchema);