import { House, MessageSquare, Search } from "lucide-react"

const BottomNavbar = () => {
  return (
    
    <div className="btm-nav btm-nav-lg border-t fixed bottom-0 left-0 right-0">
      
  <button className="text-primary">
  <House />
  </button>
  <button className="text-primary">
  <Search />
  </button>
  <button className="text-primary active">
  <MessageSquare />  
  </button>
</div>
  )
}

export default BottomNavbar