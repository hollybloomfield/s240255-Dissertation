import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { CalendarDays, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import moment from "moment";

const SignUpPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    password: "",
  })
  const [isFemale, setIsFemale] = useState(false)

  const {signup, isSigningUp} = useAuthStore()

  //returning errors if form isn't filled out properly
  const validateForm = () => {
    if (!formData.firstName.trim()) return toast.error("First name is required")
    if (!formData.lastName.trim()) return toast.error("Last name is required")
    if (!formData.email.trim()) return toast.error("Email is required")
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format")
    if (!formData.password) return toast.error("Password is required")
    if (!formData.dateOfBirth) return toast.error("Date of Birth is required")
    if (formData.password.length < 8) return toast.error("Password must be at least 6 characters")
    if (!isFemale) return toast.error("You must be female to create an account")

    const userDob = moment(formData.dateOfBirth)
    const minAge = moment().subtract(16, "years")

    if (!userDob.isValid() || userDob.isAfter(minAge)) {
      return toast.error("You must be at least 16 years old to sign up")
    }

    return true

  }

  //stops page from refreshing and losing all data when form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault()

    const success = validateForm()
    
    if(success===true) {
      
      await signup(formData)
      navigate("/create-profile")}
  }


  return (
    <div className=" w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-primary via-secondary to-accent animate-gradient bg-[length:400%_400%] ">
      <div className="max-w-2xl mx-auto p-4 py-4">
    <div className="p-4 space-y-8 card card-compact bg-base-100 w-full shadow-xl">
      <div className="flex flex-col items-center">
        
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="font-gluten text-primary text-6xl mt-1">
                Festie
              <p className="text-base-content/60 font-sans text-sm">Find your Festival Bestie!</p>
              </div>
              
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>              
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <div className="flex items-center w-full">
                <input
                  type="text"
                  placeholder="First Name"
                  className="input input-bordered input-primary w-full rounded-l-full px-4 py-2"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
      
                <input
                  type="text"
                  placeholder="Last Name"
                  className="input input-bordered input-primary w-full rounded-r-full px-4 py-2"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
              </div>

              <div className="form-control">
              <label className="input input-bordered input-primary rounded-full flex items-center gap-2">
                  <Mail className="text-primary"/>
                <input 
                type="email" 
                className="" 
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </label>
              </div>

              <div className="form-control">
              <label className="input input-bordered input-primary rounded-full flex items-center gap-2">
              <CalendarDays className="text-primary" />
              <input
                  type="date"
                  className=" w-full"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                />
              </label>
              </div>

              
              <div className="form-control">
              <label className="input input-bordered input-primary rounded-full flex items-center gap-2">
              <Lock className="text-primary"/>
              <input
                  type={showPassword ? "text" : "password"}
                  className="ml-auto w-full appearance-none"
                  placeholder="●●●●●●●●"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                type="button"
                className="ml-auto"
                onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="text-primary"/>
                  ) : (
                    <Eye className="text-primary" />
                  )}

                </button>
              </label>
              </div>
              <div className="form-control">
                
                <label className="label cursor-pointer flex justify-start space-x-2">
                   <input type="checkbox" className="checkbox checkbox-primary" onClick={() => setIsFemale(!isFemale)}/>
                  <span className="label-text text-left">I confirm that I am Female</span>
                 
                  
                  
                </label>
              </div>


              <div className="flex justify-center">
              <button type="submit" className="btn btn-primary rounded-full w-64 text-lg" disabled={isSigningUp} >
                {isSigningUp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : ("Create Account")}
              </button>
              </div>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
                Sign in
            </Link>
            </p>
          </div>


        </div>
      </div>  
    </div>
    </div>
    </div>
  )
}

export default SignUpPage