import mongoose from 'mongoose'


import {IChat} from './types'


const chatSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    name:{
        type:String,
        default:"New Chat x"
    },

  

},{minimize:false,timestamps:true})


const Chat=mongoose.models.chat || mongoose.model<IChat>('chat',chatSchema)

export default Chat