import { useEffect, useMemo } from "react";
import { useChatStore } from "../store/useChatStore"
import ChatListSkeleton from "./Skeletons/ChatListSkeleton";
import { Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatList = () => {
    const {getUsers, users, isUsersLoading, selectedUser, setSelectedUser, isNewMessage, subscribeToChats, unsubscribeFromChats} = useChatStore()
    const {onlineUsers} = useAuthStore()

    console.log("selected user in chatlist:", selectedUser)

    useEffect(()=> {
        getUsers()

        subscribeToChats()

        return () => unsubscribeFromChats()
        
    },[getUsers])

   //sorts users only when user state changes
    const sortedUsers = useMemo(() => {
      return [...users].sort((a, b) => new Date(b.chatUpdatedAt) - new Date(a.chatUpdatedAt)); // sort users by chatupdatedAt
    }, [users]);
    console.log("sortedUsers: ", sortedUsers)
    if (isUsersLoading && !isNewMessage) return <ChatListSkeleton /> //only shows skeleton when first loading the component

  return (
    <aside
    className="h-full w-full sm:w-80 
  flex flex-col transition-all duration-200 sm:border-r sm:border-primary bg-neutral/90"
  >
   
    <div className="flex flex-col">
    <div className="border-b border-primary w-full p-1 bg-base-100">
      <div className="flex items-center gap-3 text-primary">
        <Users className="w-6 h-6" />
        <span className="font-semibold">Messages</span>
      </div>
    </div>

  
      {/* <label className="input input-bordered border-primary flex items-center gap-2 h-8 bg-base-100 m-1">
<input 
  type="text" 
  className="grow" 
  placeholder="Search Messages"
   />
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 16 16"
  fill="currentColor"
  className="h-4 w-4 opacity-70 text-primary"
 >
  <path
    fillRule="evenodd"
    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
    clipRule="evenodd" />
</svg>
</label> */}

</div>
   
    <div className="overflow-y-auto w-full ">
      {sortedUsers.map((user) => (
        <button key={user._id} 
        className={`
          w-full p-3 flex items-center gap-3
          hover:bg-secondary transition-colors border-b  border-secondary
          ${selectedUser?._id === user._id ? "bg-secondary" : ""}
        `}
        onClick={() => setSelectedUser(user)}>
         
          <div className="relative mx-auto lg:mx-0">
            <img src={user.profilePic || "/avatar.png"}
            alt={user.firstName}
            className="size-12 rounded-full object-cover" 
            />
            {onlineUsers.includes(user._id) && (
              <span className="absolute bottom-0 right-0 size-3 bg-green-500
              rounded-full ring-1 ring-white" />
            )}
          </div>

         
          <div className="text-left min-w-0 flex-1">
            <div className="font-medium truncate text-black">{user.firstName}</div>
            <div className="text-sm text-primary truncate">
            {user.lastMessage === "An Image was shared" 
              ? <span className="italic">{user.lastMessage}</span>
              : user.lastMessage || <span className="italic">Draft</span>}
            </div>
          </div>
          <div className="text-xs text-primary">
              {formatMessageTime(user.chatUpdatedAt)}
            </div>



        </button>
      ))}
      {users.length === 0 && (
        <div className="text-center text-primary py-4">No users found</div>
      )}

      
    </div>
  </aside>
  )
}

export default ChatList