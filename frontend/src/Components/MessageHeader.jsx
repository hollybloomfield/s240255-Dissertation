import { useChatStore } from "../store/useChatStore"
import {useAuthStore} from "../store/useAuthStore"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

const MessageHeader = () => {
const {selectedUser, setSelectedUser, blockUser, unblockUser, blockedUsers, getBlockedUsers} = useChatStore()

const {onlineUsers} = useAuthStore()

console.log("selected user in message header:", selectedUser)

  useEffect(() => {
       getBlockedUsers()
    }, [getBlockedUsers]);

const handleBlock = async (e) => {

    if (blockedUsers.includes(selectedUser._id)) {
        await unblockUser()
    } else {
        await blockUser()
       
    }
}


  return (
    <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="avatar">
                    <div className="size-10 rounded-full relative">
                        <img
                        src={selectedUser.profilePic || "/avatar.png"}
                        alt={selectedUser.firstName}/>
                    </div>
                </div>

                <div>
                    <h3 className="font-medium">{selectedUser.firstName}</h3>
                    <p className="text-sm text-primary">
                        {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
            <button className="btn btn-error btn-sm text-white"
                onClick={handleBlock}
            >
                {blockedUsers.includes(selectedUser._id) ? 'Unblock' : 'Block'}
            </button>
            <button className="btn btn-ghost btn-sm btn-circle"
            onClick={()=> setSelectedUser(null)}>
                <X />
            </button>
            </div>
        </div>
    </div>
  )
}

export default MessageHeader