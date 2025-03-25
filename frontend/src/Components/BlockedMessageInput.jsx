import { Image, Send, X } from "lucide-react"

const BlockedMessageInput = () => {
  return (
        <div className="p-4 w-full">
           
            <form className="flex items-center gap-2">
                <div className="flex-1 flex gap-2">
                    <input
                    type="text"
                    className="w-full input input-bordered rounded-lg input-md"
                    placeholder="Type a message..."
                    disabled={true}
                    
                    />
                    
                    <button
                    type="button"
                    className="flex btn btn-circle btn-md
                        text-zinc-400"
                    
                    disabled={true}>
                        <Image size={22} />
                    </button>
    
                </div>
                <button
                type="submit"
                className="btn btn-sm btn-circle btn-primary"
                disabled={true}>
                    <Send size={21}/>
                </button>
            </form>
        </div>
  )
}

export default BlockedMessageInput