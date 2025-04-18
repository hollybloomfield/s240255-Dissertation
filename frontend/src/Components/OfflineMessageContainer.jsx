import { WifiOff } from 'lucide-react'
import React from 'react'

const OfflineMessageContainer = () => {
    return (
        <div className="w-full h-full flex items-center justify-center ">
        <div className="max-w-md text-center space-y-6">
       
          <div className="flex justify-center gap-4 mb-4">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center
               justify-center animate-bounce"
              >
                <WifiOff className="w-8 h-8 text-primary " />
              </div>
            </div>
          </div>
    
         
          <h2 className="text-2xl text-base-content/60">Offline</h2>
        </div>
      </div>
      )
}

export default OfflineMessageContainer