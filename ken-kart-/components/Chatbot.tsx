

import { connectDB } from '@/lib/db';
import ChatClient from './chatClient';
import { auth } from '@clerk/nextjs/server';
import Chat from '@/models/chat.model';
import User from '@/models/user.model';
import Message from '@/models/message.model';
import { IChat } from '@/models/types';

const Chatbot = async() => {


await connectDB()
const {userId}=await auth()
if(!userId){
  throw new Error("unauthiorized")
}
const currUser=await User.findOne({clerkId:userId})
if(!currUser){
  throw new Error("unauthiorized")
}


const userChats:IChat[]=await Chat.find({userId:currUser?._id}).lean()


  return (
    <div className='fixed bottom-10 right-10'>

      <ChatClient Chats={JSON.parse(JSON.stringify(userChats))} />

</div>
  )
}

export default Chatbot
