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
        const {selectedUser, messages} = get()
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
            set({messages:[...messages, res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }, //sends messages to backend

    subscribeToMessages: () => {
        const {selectedUser} = get()
        if (!selectedUser) return

        const socket = useAuthStore.getState().socket //gets the socket from the authStore

        socket.on("newMessage", (newMessage) => {
            if(newMessage.senderId !== selectedUser._id) return //return out of function if selected user is not equal
                                                                //to the sender Id in the newMessage in database
            set({messages: [...get().messages, newMessage]  //appends the new message onto the messages array           
            })
        })
    }, //subscribes to the newMessage event in the backend

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")
    }, //unsubscribes from the newMessage event (for performance)

    setSelectedUser: (selectedUser) => set({selectedUser}),
})) //sets the selected user 