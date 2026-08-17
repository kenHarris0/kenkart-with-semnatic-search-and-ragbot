"use server"

import { connectDB } from "@/lib/db"
import Chat from "@/models/chat.model"
import Message from "@/models/message.model"
import { auth } from "@clerk/nextjs/server"
import axios from "axios"

export default async function sendMessage(chatId:string,content:string){
    try{

        await connectDB()

        const {userId}=await auth()
        if (!userId) {
      return {
        success: false,
        message: "Unauthorized",
      }
    }


if (!content.trim()) {
      return {
        success: false,
        message: "Message cannot be empty",
      }
    }


    //verify chat belong to user

    const chat=await Chat.findById(chatId)

        if (!chat) {
      return {
        success: false,
        message: "Chat not found",
      }
    }

    await Message.create({
        role:"user",
        content,
        chatId
    })

    const history=await Message.find({
        chatId
    }).sort({createdAt:1}).lean()

    const res=await axios.post("http://localhost:8000/chat",{query:content,history})
     if (!res.data.success) {
      return {
        success: false,
        message: "AI failed",
      }
    }

    const aimessage=await Message.create({
        chatId,
        role:"assistant",
        content:res.data.answer
    })

    return {
        success:true,
        message:aimessage.content
    }



    }
    catch(err){
        console.log(err)
          return {
      success: false,
      message: "Something went wrong",
    }
    }
 
}


