import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import MessageHeader from "./MessageHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./Skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import {formatMessageTime} from "../lib/utils"
import BlockedMessageContainer from "./BlockedMessageContainer";
import BlockedMessageInput from "./BlockedMessageInput";


const MessageContainer = () => {
  const {messages, getMessages, isMessagesLoading, selectedUser, 
    subscribeToMessages, unsubscribeFromMessages, blockedUsers}=useChatStore()
  const {authUser} = useAuthStore()
  const messageEndRef = useRef(null)

 
    
  useEffect(() => {
      getMessages(selectedUser._id)

      subscribeToMessages()

      return () => unsubscribeFromMessages()
    }, [selectedUser._id, getMessages]) //useEffect runs if any of these change
    //useEffect unsubscribes from messages if it returns

  useEffect(()=>{
    if(messageEndRef.current && messages){
    messageEndRef.current.scrollIntoView({behavior: "smooth"})} //scroll to end of messages
  },[messages])

  if(isMessagesLoading) { return (
    <div className="flex-1 flex flex-col overflow-auto">
      <MessageHeader/>
      <MessageSkeleton/>
      <MessageInput/>
    </div>
  )}

  if(blockedUsers.includes(selectedUser._id) || selectedUser.blockedUsers.includes(authUser._id)) { return (
    <div className="flex-1 flex flex-col overflow-auto h-full">
      <MessageHeader/>
      <BlockedMessageContainer/>
      <BlockedMessageInput/>
    </div>
  )}
  


  return (
    <div className="flex-1 flex flex-col overflow-auto h-full">
      <MessageHeader/>
      

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message)=> (
          <div
          key={message._id}
          className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          ref={messageEndRef}>
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border" >
                <img src={message.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"}
                alt="Profile picture"/>
              </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
                </div>
                <div className="chat-bubble flex flex-col">
                  {message.image && (
                    <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"/>
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>

          </div>
        ))}
      </div>

      <MessageInput />



    </div>
  )
}

export default MessageContainer