import {create} from "zustand"

export const useOfflineStore = create((set) => ({
 isOffline: !navigator.onLine,

    checkIfOffline: () => {
        //event handlers for when the application changes from online to offline
        const handleOnline = () => {
            set({isOffline: false})
        }
        const handleOffline = () => {
            set({isOffline: true})
        }
      
        //listens for online or offline event and calls the handlers above
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        //remove event listeners
        return () => {
          window.removeEventListener('online', handleOnline)
          window.removeEventListener('offline', handleOffline)
        }
    },
}))