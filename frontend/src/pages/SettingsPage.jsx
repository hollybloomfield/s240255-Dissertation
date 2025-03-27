import { ArrowLeft, Cake, Mail, Moon, Sun, User } from "lucide-react"
import { useAuthStore } from "../store/useAuthStore"
import { useNavigate } from "react-router-dom"
import {useThemeStore} from "../store/useThemeStore"

const SettingsPage = () => {
  const {authUser} = useAuthStore()
  const navigate = useNavigate()
  const {theme, setTheme} = useThemeStore()

  console.log(theme)

  return (
    <div className="w-full min-h-screen bg-secondary/80 flex items-center justify-center">
    <div className="max-w-2xl mx-auto p-4 py-4 w-full">
      <div className="p-4 space-y-8 card card-compact bg-base-100 w-full shadow-xl">
        
        <div className="text-center">
        <button className="btn btn-ghost flex items-center" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4" />Back
          </button>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="mt-2">Your profile information</p>
        </div>

        {/* User Info */}
   
        <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{`${authUser.firstName} ${authUser.lastName}`} </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Cake className="w-4 h-4" />
                Birthday
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{new Date(authUser.dateOfBirth).toLocaleDateString()} </p>
            </div>
          </div>

          <div className="mt-1 p-1">
          
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-500">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
       
        <div className="flex flex-col items-center pb-2">
          <label className="flex items-center space-x-2">
            <span className="text-lg font-semibold"> {theme === "FestieDark" ? "Dark Mode" : "Light Mode" }</span>
            <input 
              type="checkbox" 
              className="toggle toggle-primary" 
              checked={theme === "FestieDark"}
              onChange={() => setTheme(theme === "Festie" ? "FestieDark" : "Festie")}
            />
            {theme === "FestieDark" ? (<Moon className="size-5"/>) : (<Sun className="size-5"/>) }
            
          </label>
        </div>

      </div>
    </div>
  </div>
  )
}

export default SettingsPage