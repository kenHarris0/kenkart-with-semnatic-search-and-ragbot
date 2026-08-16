'use server'

import React from 'react'
import { connectDB } from '../db'
import Product from '@/models/product.model'
import { auth } from '@clerk/nextjs/server'
import User from '@/models/user.model'
import { IUser } from '@/models/types'


interface IItem{product:string,quantity:number}

export async function addtocartfunc(productId:string){
try{
    await connectDB()
    const {userId}=await auth()
    if (!userId) {
    return {
        success: false,
        message: "Please login first"
    };
}
    const currProduct=await Product.findById(productId)
   

    const user=await User.findOne({clerkId:userId})
if (!currProduct) {
    return {
        success: false,
        message: "Product not found"
    }
}

if (!user) {
    return {
        success: false,
        message: "User not found"
    }
}
//check if curr item is already in cart

 const existingItem=user.cartItems.find((item:IItem)=>item.product.toString()===productId)

if(existingItem){
    existingItem.quantity+=1
}
else{
    user.cartItems.push({
        product:productId,
        quantity:1
    })
}


await user.save()


const fitem=user.cartItems.find((item:IItem)=>item.product.toString()===productId)
await user.populate("cartItems.product");
return {
    success:true,
    quantity:fitem?.quantity,
    total:user.cartItems.length ?? 0,
    cartitem:JSON.parse(JSON.stringify(user.cartItems))
}


    
}
catch(err){
    console.log(err)
     return {
        success:false,
        message:"Something went wrong"
    }
}
  
}


