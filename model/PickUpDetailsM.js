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
        required:true
    },
    PhoneNumber:{
        type:String,
        required:true
    },
    WasteKG:{
        type:Number,
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