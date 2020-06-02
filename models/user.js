var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var {hash, compare} = require('bcrypt');

var userSchema = new Schema({
    name : {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
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

    isVerified: {
        type: Boolean,
        default: false
    },

    favorited : [{
        type: Schema.Types.ObjectId,
        ref: "Product",
        default: ''
    }],

    cartItems : [{
        type: Schema.Types.ObjectId,
        ref: "Cart",
        default: ""
    }]
},{timestamps: true});

userSchema.pre("save", async function(next) {
    try {
        if(this.email == process.env.ADMIN) {
            this.isAdmin = true;
        }
        console.log(this.password);
        this.password = await hash(this.password, 5);
        console.log(this.password);
        
        next()
    } catch (error) {
        res.json({
            success: false,
            msg: "Error in password hashing",
            error
        })   
    }
});

userSchema.methods.encryptPassword = async function(password) {
    try {
        password = await hash(password, 10);
        return password;
    } catch (error) {
        return(null);
    }
}

userSchema.methods.checkPassword = async function(password) {
    try {
        console.log("This Password: ", this.password);
        console.log("Password: ",password);
        return await compare(password, this.password);
    } catch (error) {
        console.log(error);
       return(false);
    }
}

module.exports = mongoose.model("User",userSchema);