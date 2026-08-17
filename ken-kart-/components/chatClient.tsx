"use client"
import React, { useState } from 'react'
import { Badge, BotMessageSquare } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import CreateNewchat from '@/lib/actions/chats/CreateNewchat';
import sendMessage from '@/lib/actions/chats/sendMessage';
import { IChat, IMessage } from '@/models/types';
import getUserchatmessage from '@/lib/actions/chats/getUserchatmessage';

const ChatClient = ({Chats}:{Chats:IChat[]}) => {
const [clickbot,setclickbot]=useState<boolean>(false)
const [ChatId,setchatid]=useState<string>("")
const [message, setMessage] = useState("")
const [toggleHistory,settogglehostory]=useState<boolean>(false)

const[chatMessages,setchatMessages]=useState<IMessage[]>([])


const [allchats,setallchats]=useState<IChat[]>(Chats)

    const createnewChat=async()=>{
      try{
        const res=await CreateNewchat()
        if(res.success){
          alert("new chat created")
          if(res.chatId){
            
          setchatid(res.chatId)
          setchatMessages([])
          setallchats(prev=>[
            res.newchat,
            ...prev
          ])
          }
        }
        else{
          return
        }
    
      }
      catch(err){
        
        console.log(err)
      }
    }
    
    const sendusermessage = async () => {
     
       if(!ChatId || !message.trim()) return
       const currMessage=message

       setchatMessages(prev=> [
        ...prev,
        {
          chatId:ChatId,
          role:"user",
          content:currMessage
        }
       ])
       setMessage("")

       try {

    const res = await sendMessage(
      ChatId,
      currMessage
    )

    if (res.success) {

      // add AI response
      setchatMessages(prev => [
        ...prev,
        {
          chatId:ChatId,
          role: "assistant",
          content: res.message,
        }
      ])
    }
  }
      
      catch (err) {
        console.log(err)
      }
    }


 console.log(ChatId)

const selectChat = async (chatId: string) => {
  try {
    setchatid(chatId)

    const res = await getUserchatmessage(chatId)

    if (res.success) {
      setchatMessages(res.messages)
    }

    settogglehostory(false)

  } catch (err) {
    console.log(err)
  }
}
    
 return (
  <div>
    {clickbot && (
      <div
        className="
          absolute bottom-14 right-0
          w-[400px] h-[500px]
          bg-white border rounded-2xl shadow-xl
          z-50 flex flex-col
        "
      >

        {/* Header */}
        <div className="h-12 shrink-0 border-b flex items-center justify-between px-3">
          <h1 className="font-medium">
            Support Bot
          </h1>

          <div className="flex items-center gap-2">
            <Button
              className="h-8 cursor-pointer"
              onClick={createnewChat}
            >
              New Chat
            </Button>

            <Button
              className="h-8 cursor-pointer"
              onClick={() =>
                settogglehostory(prev => !prev)
              }
            >
              History
            </Button>
          </div>
        </div>


        {/* Chat Body */}
        <div className="flex-1 min-h-0 flex flex-col">

          {/* Chat History */}
          {toggleHistory && (
            <div
              className="
                shrink-0
                w-full
                h-15
                border-b
                flex items-center
                gap-2
                p-2
                overflow-x-auto
              "
            >
              {allchats.map((chat) => (
                <Button
                  key={chat._id}
                  className="cursor-pointer shrink-0"
                  onClick={() => selectChat(chat._id!)}
                >
                  {chat.name}
                </Button>
              ))}
            </div>
          )}


          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3">

            <div className="flex flex-col gap-2">

              {chatMessages.map((msgs) => (
                <div
                  key={
                    msgs._id?.toString() ??
                    `${msgs.chatId}-${msgs.content}`
                  }
                  className={`w-full flex ${
                    msgs.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`
                      max-w-[75%]
                      border
                      rounded-2xl
                      p-2
                      wrap-break-words
                      ${
                        msgs.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-black"
                      }
                    `}
                  >
                    {msgs.content}
                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>


        {/* Input */}
        <div
          className="
            shrink-0
            h-14
            border-t
            p-2
            flex
            items-center
            gap-2
          "
        >

          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              ChatId
                ? "Ask something..."
                : "Create or select a chat"
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendusermessage()
              }
            }}
          />

          <Button
            className="cursor-pointer"
            onClick={sendusermessage}
            disabled={!ChatId || !message.trim()}
          >
            Send
          </Button>

        </div>

      </div>
    )}


    {/* Chatbot Icon */}
    <div
      className="
        border
        rounded-full
        p-1
        hover:scale-[1.10]
        transition-all
        duration-300
      "
    >
      <BotMessageSquare
        className="w-12 h-12 cursor-pointer"
        onClick={() => setclickbot(prev => !prev)}
      />
    </div>

  </div>
)
}

export default ChatClient
