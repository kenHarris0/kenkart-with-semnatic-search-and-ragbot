"use server"

import { connectDB } from "@/lib/db"
import Message from "@/models/message.model"
import { auth } from "@clerk/nextjs/server"


export default async function  getUserchatmessage(chatId:string){
    try{
        await connectDB()

        const {userId}=await auth()
        if(!userId){
            return{
                "success":false
            }
        }

        const Chatmessages=await Message.find({chatId:chatId}).sort({createdAt:1})

        return {
            "messages":JSON.parse(JSON.stringify(Chatmessages)),
            "success":true
        }


    }
    catch(err){
        console.log(err)
        return{
            "success":false,
            "messages":[]
        }
    }
  
}

