import { NextRequest,NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import User from "@/models/user.model";
import Product from "@/models/product.model";

export async function POST(){

      console.log("SYNC ROUTE HIT");

   const {userId}=await auth()

   await connectDB()

   if(!userId){
    return NextResponse.json({},{status:401})
    
   }

    let user = await User.findOne({
        clerkId: userId,
    });
    

    if(!user){
        const clerkuser=await currentUser()
console.log(clerkuser);
console.log(clerkuser?.firstName);
        user=await User.create({
            clerkId:clerkuser!.id,
            name:clerkuser!.firstName || clerkuser!.lastName || clerkuser!.emailAddresses[0].emailAddress.split('@')[0],
            email:clerkuser!.emailAddresses[0].emailAddress,

        })
    }

   

    return NextResponse.json({user:JSON.parse(JSON.stringify(user)),success:true})

   





}