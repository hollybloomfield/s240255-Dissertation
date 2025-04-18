import { useChatStore } from "../store/useChatStore"
import ChatList from "../Components/ChatList"
import NoChatSelected from "../Components/NoChatSelected"
import MessageContainer from "../Components/MessageContainer"
import { useEffect } from "react"
import { useOfflineStore } from "../store/useOfflineStore"
import OfflineMessageContainer from "../Components/OfflineMessageContainer"

const MessagesPage = () => {
    const {selectedUser} = useChatStore()
    const {isOffline} = useOfflineStore()

  return (
    <div className="pt-[79px] pb-[79px] w-full">
   
 
      <div className="bg-base-100 w-full h-[calc(100vh-10rem)]">
      <div className="flex h-full overflow-hidden">
        <div className={`w-full sm:w-80 ${selectedUser ? 'hidden sm:inline-flex' : `inline-flex`} h-full
              `}>
          <ChatList />
        </div>
        
        <div className={`
              ${selectedUser ? 'block' : 'hidden'}
              sm:block
              flex-1 h-full
            `}>
          {isOffline ? (<OfflineMessageContainer/>) :
          !selectedUser ? (<NoChatSelected />) : (<MessageContainer/>)}
        
        </div>
        </div>
        </div>
   
   </div>
  )
}

export default MessagesPage