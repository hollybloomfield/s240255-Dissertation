import {create} from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set, get)=> ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isNewMessage: false,
    isMessageSending: false,
    blockedUsers: [],

    getUsers: async () => {
        set({isUsersLoading: true})
    
        try {
            const res = await axiosInstance.get("/messages/users")
            set({users: res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isUsersLoading: false})
        }
    }, //gets users from backend, showing only users that have got active chats with eachother

    getMessages: async (userId) => {
        set({isMessagesLoading: true})
        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({messages: res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isMessagesLoading: false})
        }
    }, //gets messages from backend using current user and selected user Id's

    sendMessage: async(messageData) => {
        const {selectedUser, messages, getUsers} = get()
        set({isNewMessage: true})
        set({isMessageSending: true}) 
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)

            set((state) => ({messages:[...state.messages, res.data]}))

            await getUsers() //refresh user store so its up to date
    
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isNewMessage: false})
            set({isMessageSending: false}) 
        }
    }, //sends messages and update/create chat collection in backend

    subscribeToMessages: () => {
        const {selectedUser} = get()
        if (!selectedUser) return

        const socket = useAuthStore.getState().socket //gets the socket from the authStore

        socket.on("newMessage", (newMessage) => {
            if(newMessage.senderId !== selectedUser._id) return //return out of function if selected user is not equal
                                                                //to the sender Id in the newMessage in database
            set((state) => ({
                messages: [...state.messages, newMessage],
                }));  //appends the new message onto the messages array           
            
        })
    }, //subscribes to the newMessage event in the backend

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")
    }, //unsubscribes from the newMessage event (for performance)

    subscribeToChats: () => {
        const socket = useAuthStore.getState().socket

        socket.on("newChat", (newChat) => {
            //add senderChatUser from emit onto user array
            set((state) => ({
                users: [...state.users, newChat]
            }))
        })
        socket.on("updateChats", (updatedChat) => {
            //Find senderChatUser's ID from the emit, in the user 
            // array and update that user (including latest message and updated at) 
            set((state) => ({
                users: state.users.map((user) => 
                    user._id === updatedChat._id ? { ...user, ...updatedChat } : user
            )
            }))
        })
    }, //subscribes to "newChat" and "updateChats" event to update chatList in real-time

    unsubscribeFromChats: () => {
        const socket = useAuthStore.getState().socket
        socket.off("newChat")
        socket.off("updateChats")
    }, //unsubscribes from "newChat" and "updateChats" event

    blockUser: async() => {
        const {selectedUser} = get()
        if(!selectedUser) return;
        try {
            
            const res = await axiosInstance.post(`/messages/block/${selectedUser._id}`)

            set({blockedUsers: res.data}) //set blocked user store to response
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    unblockUser: async() => {
        const {selectedUser} = get()
        if(!selectedUser) return;
        try {
            const res = await axiosInstance.delete(`/messages/unblock/${selectedUser._id}`)
            
            set({blockedUsers: res.data})  //set blocked user store to response
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    getBlockedUsers: async () => {
        try {
            const res = await axiosInstance.get("/messages/blocked-users/get")
            
            set({blockedUsers: res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    subscribeToBlock: () => {
        const socket = useAuthStore.getState().socket

        if(!socket) return

        socket.on("userBlocked", (updatedBlockedUsers)=> {
            const {selectedUser, users} = get()
                   
            if (selectedUser && selectedUser._id === updatedBlockedUsers._id) {
            //only run if selected user matches ID from event
            set((state) => ({
                
                ...state,
                selectedUser: {
                    ...state.selectedUser,
                    blockedUsers: updatedBlockedUsers.blockedUsers,
                } //overwrites the blockedUsers array in selected user
            }))        
        } 

        set((state) =>({
           users: state.users.map((user)=>
            user._id === updatedBlockedUsers._id
                ? {...user, blockedUsers: updatedBlockedUsers.blockedUsers} : user
        ) 
        })) //overwrites the blockedUsers array in user array with matching ID from event
        
        })

        socket.on("userUnblocked", (updatedBlockedUsers)=> {
            const {selectedUser} = get()
            if (selectedUser && selectedUser._id === updatedBlockedUsers._id) {
            set((state) => ({
                ...state,
                selectedUser: {
                    ...state.selectedUser,
                    blockedUsers: updatedBlockedUsers.blockedUsers,
                }
            }))}

            set((state) =>({
                users: state.users.map((user)=>
                 user._id === updatedBlockedUsers._id
                     ? {...user, blockedUsers: updatedBlockedUsers.blockedUsers} : user
             ) 
             }))
           
        })
    },

    unsubscribeFromBlock: () => {
        const socket = useAuthStore.getState().socket
        if(!socket) return
        socket.off("userBlocked")
        socket.off("userUnblocked")
    },

  
    setSelectedUser: (selectedUser) => set({selectedUser}),
})) //sets the selected user 