import { useChatStore } from "../store/useChatStore"
import ChatList from "../Components/ChatList"
import ChatMessages from "../Components/ChatMessages"
import NoChatSelected from "../Components/NoChatSelected"

const MessagesPage = () => {
    const {selectedUser} = useChatStore()
    console.log("selected users:" , selectedUser)
  return (
    <div className="pt-[79px] pb-[79px] w-full">
   
 
      <div className="bg-secondary/60 w-full h-[calc(100vh-10rem)]">
      <div className="flex h-full overflow-hidden">
        <ChatList />
        <div className="hidden sm:inline-flex flex-1">
          {!selectedUser ? <NoChatSelected /> : <ChatMessages/>}
        
        </div>
        </div>
        </div>
   
   </div>
  )
}

export default MessagesPage