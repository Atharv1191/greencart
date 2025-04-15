
const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
        ref:'user'
    },
    items:[{
        product:{
            type:String,
            ref:'product',
            required:true
        },
        quantity:{
            type:Number,
            required:true
        }
    }],
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default:"Order Placed"
    },
    address:{
        type:String,
        required:true,
        ref:'address'
    },
    paymentType:{
        type:String,
        required:true
    },
    
    isPaid:{
        type:Boolean,
        default:false,
        required:true
    }
},{timestamps: true})
const Order = mongoose.models.order || mongoose.model("Order", orderSchema)
module.exports = Order