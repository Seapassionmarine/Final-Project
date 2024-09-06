const mongoose = require('mongoose')

const PickUpSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Address:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    PhoneNumber:{
        type:String,
        required:[true,"phone number is required"],
        unique:true
    },
    WasteKG:{
        type:String,
        required:true
    },
    user:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:"user",
        }
    ],
},{timestamps:true})

const wasteModel = mongoose.model ('waste',PickUpSchema)
module.exports = wasteModel