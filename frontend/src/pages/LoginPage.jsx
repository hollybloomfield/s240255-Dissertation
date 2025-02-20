import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const {login, isLoggingIn} = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  }




  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-primary via-secondary to-accent animate-gradient bg-[length:400%_400%] ">
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
              
              <h1 className="text-2xl font-bold mt-2">Welcome Back!</h1>
              <p className="text-base-content text-lg font-sans"></p>           
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
           
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
            

              <div className="flex justify-center">
              <button type="submit" className="btn btn-primary rounded-full w-64 text-lg" disabled={isLoggingIn} >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : ("Login")}
              </button>
              </div>
          </form>
                <div className="text-center">
                  <p className="text-base-content/60">
                  Don't have an account?{" "}
                  <Link to="/signup" className="link link-primary">
                      Create account
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

export default LoginPage