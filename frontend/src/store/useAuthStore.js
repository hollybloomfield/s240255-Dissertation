import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";
import { useChatStore } from "./useChatStore.js";

const BASE_URL = "http://localhost:5001"

// Global State Store
export const useAuthStore = create((set, get) => ({
    //initial states
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    //check if user is authenticated during refresh
    isCheckingAuth: true,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")


            set({authUser:res.data})

            get().connectSocket()
        } catch (error) {
            console.log("Error in checkAuth:", error)
            set({authUser:null})
        } finally {
            set({isCheckingAuth: false})
    }
    },

    signup: async (data) => {
        set({isSigningUp: true})
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data})
            toast.success("Account created successfully")
            get().connectSocket()
            
        } catch (error){
            toast.error(error.response.data.message)

        } finally {
            set({ isSigningUp: false})
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({ authUser: null})
            toast.success("Logged out successfully")
            get().disconnectSocket()
            
        } catch (error) {
            toast.error(error.response.data.message)
        }
        
    },

    login: async (data) => {
        set({ isLoggingIn: true})
        try {
            const res = await axiosInstance.post("/auth/login", data)
            console.log("Login response:", res.data)
            set({ authUser: res.data})
            toast.success("Logged in successfully")
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isLoggingIn: false})
        }
        
    },

    updateProfile: async(data) => {
        set({isUpdatingProfile: true})
        try {
            const res = await axiosInstance.put("auth/update-profile", data)
            set({ authUser: res.data})
            toast.success("Profile updated successfully")
        } catch (error) {
            console.log("error in update profile:", error)
            toast.error(error.response.data.message)
        } finally {
            set({isUpdatingProfile: false})
        }
    },

    connectSocket: () => {
        const {authUser} = get()

        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL,{
            query: {
                userId: authUser._id,
            },
        }) //sending the user Id in the query of the socket

        socket.connect() //connect to socket in backend

        set({socket:socket})

        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds})
        }) //calling getOnlineUsers which emits the array of online users to all clients
    },

    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect() 
    },

    subscribeToNotifications: () => {
        const {socket} = get()
        if (!socket) return; //only subscribes if socket is active

        socket.on("newNotification", (newMessage) =>{
            const selectedUser = useChatStore.getState().selectedUser
            if (selectedUser && selectedUser._id === newMessage.senderId) return; 
            //Don't send notifications if user is already on the chat
            toast("You have a new message!", {
                icon: "🔔"
            })
        })
    }, //subsribes to "newNotification" event

    unsubscribeFromNotifications: () => {
        const {socket} = get()

        if(!socket) return;

        socket.off("newNotification")
       
    }, //unsubsribes from "newNotification" event


}))