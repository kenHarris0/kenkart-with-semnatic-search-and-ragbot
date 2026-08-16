import mongoose from "mongoose"

export interface IProduct{
    _id?:string,
    userId?:mongoose.Types.ObjectId,
    name:string,
    description:string,
   price:number,
   offerPrice:number,
   category?:string,
   image:string[],
   sellerId?:mongoose.Types.ObjectId
}

export interface IUser{
    _id?:string,
    clerkId:string,
    name:string,
    email:string,
    cartItems:{
        product:mongoose.Types.ObjectId,
        quantity:number
    }[],
    shippingAddress:string,
    role?:"user" | "admin" | "seller"
}

export interface IOrder{
    _id?: string;
    user:mongoose.Types.ObjectId,
    products:{
        product:mongoose.Types.ObjectId,
        quantity:number

    }[],
     shippingAddress: string;

  totalAmount: number;

  paymentId: string;

  razorpayOrderId: string;

   paymentStatus: "Paid" | "Pending" | "Failed";

  orderStatus:
    | "Confirmed"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled";

  createdAt?: Date;
  updatedAt?: Date;


}