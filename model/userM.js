const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String
    },
    isVerified:{ 
        type:Boolean, 
        default:false 
    },
    isAdmin:{ 
        type:Boolean, 
        default:false 
    },

},{timestamps:true})

const userModel = mongoose.model ('user',userSchema)
module.exports = userModel