

'use server'

import { auth } from "@clerk/nextjs/server"
import { connectDB } from "../db"
import User from "@/models/user.model"
import Product from "@/models/product.model"


export default async function RemovesellerProduct(id:string){
    try{
    await connectDB()

    const {userId}=await auth()
    if(!userId){
        return{
            success:false,
            
        }
    }


    const user=await User.findOne({clerkId:userId})
 if(!user){
        return{
            success:false,
            
        }
    }


   if(user.role==="admin"){
    await Product.findOneAndDelete({_id:id})
   }
   else{
await Product.findOneAndDelete({_id:id,sellerId:user._id})
   }






return {
    success:true,
    

}
    }
    catch(err){
        console.log(err)
        return{
            success:false
        }
    }
}