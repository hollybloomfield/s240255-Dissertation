import { Ban } from "lucide-react"
import { useChatStore } from "../store/useChatStore"
import { useAuthStore } from "../store/useAuthStore"

const BlockedMessageContainer = () => {
  const {selectedUser, blockedUsers} = useChatStore()
  const {authUser} = useAuthStore()
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 ">
        
    <div className="w-full text-center space-y-1">
   
   <div className="flex justify-center gap-1 mt-5">
     <div className="relative text-error">
     < Ban  />
     </div>
   </div>

  
   <h2 className="text-md text-base-content/60">
    {selectedUser.blockedUsers.includes(authUser._id) ? (
        "You have been blocked by this user."
    ) : blockedUsers.includes(selectedUser._id) ? (
        "You have blocked this user."
    ) : (
        "Blocked"
    )}
</h2>
 </div>
</div>
    
  )
}

export default BlockedMessageContainer