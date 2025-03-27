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
    maxFestivals: 50,
    festivalsAttending: [],
    isFetchingFestivalsAttending: false,

    

    getFestivals: async () => {
        const {offset, festivals, hasMore, limit, maxFestivals} = get()

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
                festivals: [...festivals, ...res.data.festivals].slice(-maxFestivals), //limits festival store to 50 festivals for performance and keeps the most recently loaded ones.
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

    attendingFestival: async (festival) => {
       
        try {

            const res = await axiosInstance.post("/festivals/attending-festival", {festival})
            console.log(res.data)
         
                set({
                    festivalsAttending: res.data.attendingFestivals 
                    // replace festival attending store with response from API
                });
            
            toast.success("Festival added")
        } catch (error) {
            toast.error("Error adding festival")
            console.log("Error adding festival attendance: ", error)
        }
    },

    notAttendingFestival: async (festivalId) => {
        const {festivalsAttending} = get()
        try {
           
            await axiosInstance.delete("/festivals/not-attending-festival", {data: {festivalId}})
            
            set({
                festivalsAttending: festivalsAttending.filter(festival => festival.festivalId !== festivalId)
            }); //remove whole object from festival attending store using the festival Id
    
            toast.success("Festival Removed")
        } catch (error) {
            toast.error("Error removing festival")
            console.log("Error removing festival attendance: ", error)
            throw error
        }
    },

    getUsersFestivalsAttending: async () => {
       set({isFetchingFestivalsAttending: true})
        try {
            const res = await axiosInstance.get("/festivals/get-attending-festivals")
            console.log("getfestivalattending store: ", res.data)
            set({festivalsAttending: res.data})
          
        } catch (error) {
            console.log("Error in getUsersFestivalsAttending:",error)
        } finally {
            set({isFetchingFestivalsAttending: false})
        }
    }

      
    //want state for toggling button and keeping state of festival id's that user is attending
    //also want state for using the festival id to navigate to the correct users attending page
}))