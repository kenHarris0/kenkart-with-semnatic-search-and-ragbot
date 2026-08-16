import mongoose from 'mongoose'


import {IOrder} from './types'


const orderSchema=new mongoose.Schema({
   user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
     required: true,
   },
   products:[
    {
        product:{
             type:mongoose.Schema.Types.ObjectId,
    ref:"product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
    }
   ],
       shippingAddress: {
      type: String,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentId: {
      type: String,
      required: true,
    },

    razorpayOrderId: {
      type: String,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Paid", "Failed", "Pending"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Confirmed",
    },


},{minimize:false,timestamps:true})


const Order=mongoose.models.order || mongoose.model<IOrder>('order',orderSchema)

export default Order