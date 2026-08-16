'use server'

import { auth } from "@clerk/nextjs/server"
import { connectDB } from "../db"
import User from "@/models/user.model"





export async function Addaddress(address:string){
    try{
await connectDB()
const {userId}=await auth()
if(!userId){
    return{
        success:false,
        message:"unauthorized"
    }
}

const user=await User.findOne({clerkId:userId})
if(!user){
    return{
        success:false,
        message:"usernot found"
    }
}

const updatedUser=await User.findByIdAndUpdate(user._id,{
    shippingAddress:address
},{new:true})


return {
    success:true,
    user:JSON.parse(JSON.stringify(updatedUser))
}


    }
    catch (err) {
    console.log(err);

    return {
        success: false,
        message: "Something went wrong",
    };
}
}