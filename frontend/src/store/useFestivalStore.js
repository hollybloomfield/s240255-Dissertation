import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useFestivalStore = create((set, get) =>({
    //initial states
    isLoading: false,
    festivals: [],
    offset: 0,
    hasMore: true,
    limit: 30,
    isSearching: false,


    fetchFestivals: async () => {
        const {offset, festivals, hasMore, limit} = get()

        if (!hasMore) return; //if theres no more festivals then return nothing

        set({isLoading: true})
        set({isSearching: false})

        try {
            const res = await axiosInstance.get(`/festivals/get-all-festivals`,{
                params: {
                    offset: offset,
                    limit: limit,
                }
            }) //using the offset and limit params set in the backend
            
            

            set({
                festivals: [...festivals, ...res.data.festivals], 
                //appending the festival data onto the festival array
                offset: offset+limit, //increasing the offset to remove duplication
                
            })
        } catch (error) {
            toast.error("Error fetching festivals")
            console.log("error in fetchFestvals:",error)
        } finally {
            set({isLoading: false})
        }
    },

    resetFestivalList: () => {
        set({ festivals: [], //removes festivals stored in the array to avoid performance and memory issues
            offset: 0, //resets offset to 0
         })
    }, 

    searchFestivals: async (keyword) => {
        set({isSearching: true})
        set({isLoading: true})
        try {
            const res = await axiosInstance.get(`/festivals/search-festivals`,{
                params: {
                    keyword  
                },
            })
            if (res.data && res.data.festivals){
                set({festivals: []})
                set({festivals: res.data.festivals})
            }
            if (keyword === "") set({isSearching: false})
        } catch (error) {
            toast.error("Error Searching festivals")
            console.log("error in searchFestvals:",error)
        } finally {
            set({isLoading: false})
        }
    },


    
    //want state for toggling button and keeping state of festival id's that user is attending
    //also want state for using the festival id to navigate to the correct users attending page
}))