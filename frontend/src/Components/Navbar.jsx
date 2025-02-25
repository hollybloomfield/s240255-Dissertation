import { Settings } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
const navigate = useNavigate()
const {logout, authUser} = useAuthStore()
const location = useLocation()

const hiddenRoutes = ["/edit-profile", "/create-profile"]

if (!authUser || hiddenRoutes.includes(location.pathname)){
  return null
}

const handleClick = () => {
  navigate("/settings")
}
console.log(authUser.profilePic)

  return (
<div className="navbar bg-base-100 border-b border-gray-100 pt-5 fixed top-0 left-0 right-0 z-[10]">
  <div className="flex-1">
    <a className="text-4xl font-gluten text-primary">Festie</a>
  </div>
  <div className="flex-none">
 
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" onClick={handleClick}>
            <Settings/>
      </div>
      
      
     <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src={authUser.profilePic || "/avatar.png"} />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li>          
            <Link to= "/edit-profile">Edit Profile</Link>
         
        </li>
        <li><button onClick={logout}>Logout</button></li>
        </ul>
      </div>
  </div>
</div>
  )
}

export default Navbar