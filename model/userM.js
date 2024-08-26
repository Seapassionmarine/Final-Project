const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName:{
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
    HomeAddress:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true,
        unique:true
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
    blackList:[]
},{timestamps:true})

const userModel = mongoose.model ('user',userSchema)
module.exports = userModel