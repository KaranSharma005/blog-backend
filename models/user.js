const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
    },
    password : {
        type : String,
        required : true,
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : {
        type : Date
    },
    profilePic : {
        type : String
    },
    isAdmin : {
        type : Boolean
    },
    bio : {
        type : String
    },
    resetToken : {
        type : String
    },
    expiryTime : {
        type : Date,

    }
},{ timestamps: true });

const userModel = mongoose.model("userSchema",userSchema);
module.exports = userModel;