import { House, MessageSquare, Search } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"

const BottomNavbar = () => {
const { authUser} = useAuthStore()
const location = useLocation()

const hiddenRoutes = ["/edit-profile", "/create-profile", "/settings"]

if (!authUser || hiddenRoutes.includes(location.pathname)){
  return null
}
  return (
    
    <div className="btm-nav btm-nav-lg border-t border-base-200 fixed bottom-0 left-0 right-0">
      
      <NavLink
        to="/" 
        className={({ isActive }) => (isActive ? "text-primary active" : "text-primary")}
        
      >
        <House />
      </NavLink>
      <NavLink
        to="/festivals" 
        className={({ isActive }) =>
          isActive || location.pathname.startsWith("/festivals") ? "text-primary active" : "text-primary"
        }
      >
        <Search />
      </NavLink>
      <NavLink
        to="/messages" 
        className={({ isActive }) => (isActive ? "text-primary active" : "text-primary")}
      >
        <MessageSquare />
      </NavLink>
</div>
  )
}

export default BottomNavbar