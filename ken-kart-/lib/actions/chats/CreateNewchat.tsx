"use server"

import { connectDB } from "@/lib/db"
import Chat from "@/models/chat.model"
import User from "@/models/user.model"
import { auth } from "@clerk/nextjs/server"

export default async function CreateNewchat(){

    try{
          
        await connectDB()
        const {userId}=await auth()
if (!userId) {
    return {
        success: false,
        message: "Unauthorized"
    }
}
        const currUser=await User.findOne({clerkId:userId})

        if(!currUser){
            return{
                "success":false,
                "message":"no user found"
            }
        }

        const newchat=await Chat.create({
            userId:currUser._id,
            name:"new chatt"
        })


        return{
            "chatId":newchat._id.toString(),
            "success":true,
            "newchat":JSON.parse(JSON.stringify(newchat))

        }
    }
    catch(err){
        console.log(err)
        return{
            "chatId":null,
            "success":false,

        }
    }
  
}


