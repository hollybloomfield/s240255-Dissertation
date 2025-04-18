import { useEffect, useMemo } from "react";
import { useChatStore } from "../store/useChatStore"
import ChatListSkeleton from "./Skeletons/ChatListSkeleton";
import { Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { useOfflineStore } from "../store/useOfflineStore";

const ChatList = () => {
    const {getUsers, users, isUsersLoading, selectedUser, setSelectedUser, isNewMessage, subscribeToChats, unsubscribeFromChats} = useChatStore()
    const {onlineUsers} = useAuthStore()
    const {isOffline} = useOfflineStore()

   

    useEffect(()=> {
      if(isOffline) return

        getUsers()
        subscribeToChats()

        return () => unsubscribeFromChats()
        
    },[isOffline])

   //sorts users only when user state changes
    const sortedUsers = useMemo(() => {
      return [...users].sort((a, b) => new Date(b.chatUpdatedAt) - new Date(a.chatUpdatedAt)); // sort users by chatupdatedAt
    }, [users]);
   
    if (isUsersLoading && !isNewMessage) return <ChatListSkeleton /> //only shows skeleton when first loading the component

  return (
    <aside className="h-full w-full sm:w-80 flex flex-col transition-all duration-200 sm:border-r sm:border-primary bg-neutral/90">
    <div className="flex flex-col">
      <div className="border-b border-primary w-full p-1 bg-base-100">
        <div className="flex items-center gap-3 text-primary">
          <Users className="w-6 h-6" />
          <span className="font-semibold">Messages</span>
        </div>
      </div>
    </div>

 
    {isOffline ? (
      <div className="text-center text-primary py-4">
        Go online to view messages
      </div>
    ) : (
      <div className="overflow-y-auto w-full">
        {sortedUsers.map((user) => (
          <button
            key={user._id}
            className={`w-full p-3 flex items-center gap-3 hover:bg-secondary transition-colors border-b border-secondary ${selectedUser?._id === user._id ? 'bg-secondary' : ''}`}
            onClick={() => setSelectedUser(user)}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || '/avatar.png'}
                alt={user.firstName}
                className="size-12 rounded-full object-cover"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-1 ring-white" />
              )}
            </div>

            <div className="text-left min-w-0 flex-1">
              <div className="font-medium truncate text-black">{user.firstName}</div>
              <div className="text-sm text-primary truncate">
                {user.lastMessage === 'An Image was shared' ? (
                  <span className="italic">{user.lastMessage}</span>
                ) : (
                  user.lastMessage || <span className="italic">Draft</span>
                )}
              </div>
            </div>
            <div className="text-xs text-primary">
              {formatMessageTime(user.chatUpdatedAt)}
            </div>
          </button>
        ))}
        {users.length === 0 && <div className="text-center text-primary py-4">No users found</div>}
      </div>
    )}
  </aside>
  )
}

export default ChatList