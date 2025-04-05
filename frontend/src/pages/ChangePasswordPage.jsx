import { ArrowLeft, Cake, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"
import toast from "react-hot-toast"

const ChangePasswordPage = () => {
    const navigate = useNavigate()
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const {isChangingPassword, changePassword} = useAuthStore()
     const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
      })

      const validateForm = () => {
        if (!formData.currentPassword.trim()) return toast.error("Current password is required")
        if (!formData.newPassword.trim()) return toast.error("New password is required")
        if (formData.newPassword.length < 8) return toast.error("Password must be at least 6 characters")
    
        return true
      } //ensure form is valid before calling function

      const handleSubmit = async (e) => {
        e.preventDefault()
    
        const success = validateForm()
        
        if(success===true) {
          await changePassword(formData) //use current password and new password to send to backend
          }
      }

  return (
    <div className="w-full min-h-screen bg-secondary/80 flex items-center justify-center">
    <div className="max-w-2xl mx-auto p-4 py-4 w-full">
      <div className="p-4 space-y-8 card card-compact bg-base-100 w-full shadow-xl">
        
        <div className="text-center">
        <button className="btn btn-ghost flex items-center" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4" />Back
          </button>
          <h1 className="text-2xl font-semibold">Change Password</h1>
          <p className="mt-2">Enter your current password and new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm flex items-center gap-2">
                Current Password
              </label>
              <div className="input input-bordered input-primary rounded-full flex items-center gap-2">
              <input
                  type={showCurrentPassword ? "text" : "password"}
                  className="justify-end w-full appearance-none"
                  placeholder="●●●●●●●●"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                />
                <button
                type="button"
                className="ml-auto"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="text-primary"/>
                  ) : (
                    <Eye className="text-primary" />
                  )}

                </button>
              </div>
            </div>

          
            <div className="space-y-1.5">
              <label className="text-sm flex items-center gap-2">          
                New Password
              </label>
              <div className="input input-bordered input-primary rounded-full flex items-center gap-2">
              <input
                  type={showNewPassword ? "text" : "password"}
                  className="justify-end w-full appearance-none"
                  placeholder="●●●●●●●●"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                />
                <button
                type="button"
                className="ml-auto"
                onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="text-primary"/>
                  ) : (
                    <Eye className="text-primary" />
                  )}

                </button>
                </div>
            </div>
            <div className="flex justify-center">
              <button type="submit" className="btn btn-primary rounded-full w-64 text-lg"  >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : ("Change Password")}
              </button>
              </div>

          </form>

      </div>
    </div>
  </div>
  )
}

export default ChangePasswordPage