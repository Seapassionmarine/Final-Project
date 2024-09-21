const mongoose = require('mongoose')

const PickUpSchema = new mongoose.Schema({
    Address:{
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
    status:{
        type:String,
        enum:['approved','pending','declined'],
        default:'pending'
    },
    userId:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true
        }
    ],
},{timestamps:true})

const wasteModel = mongoose.model ('waste',PickUpSchema)
module.exports = wasteModel