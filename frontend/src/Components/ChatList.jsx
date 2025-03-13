import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore"
import ChatListSkeleton from "./Skeletons/ChatListSkeleton";
import { Users } from "lucide-react";

const ChatList = () => {
    const {getUsers, users, isUsersLoading, selectedUser, setSelectedUser} = useChatStore()

    const onlineUsers = [];

    useEffect(()=> {
        getUsers()
    },[getUsers])

    if (isUsersLoading) return <ChatListSkeleton />


  return (
    <aside className="h-full w-full sm:w-80 
    flex flex-col transition-all duration-200 sm:border-r sm:border-primary">
       <div className="flex flex-col">
      <div className="border-b border-primary w-full p-1 bg-base-100/50">
        <div className="flex items-center gap-3 text-primary">
          <Users className="w-6 h-6" />
          <span className="font-semibold">Messages</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {users.map((user)=> (
          <button
          key={user._id}
          onClick={() => setSelectedUser(user)}
          className={`
            w-full p-3 flex items-center gap-3 ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
              src={user.profilePic || "/avatar.png"}
              alt={user.name}
              className="size-14 object-cover rounded-full"/>
              {onlineUsers.includes(user._id) && (
                <span
                className="aboslute bottom-0 right-0 size-3 bg-green-500
                rounded-full ring-2 ring-zinc-900"/>
              )}
            </div>

            <div className="text-left min-w-0">
              <div className="font-medium truncate">{user.firstName}
              </div>
              <div className="text-sm text-zinc-400"> Last message here
              </div>

            </div>




          </button>
        ))}



      </div>




      </div>
    </aside>
  )
}

export default ChatList