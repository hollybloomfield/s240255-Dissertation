import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EditProfilePage from "./pages/EditProfilePage";
import CreateProfilePage from "./pages/CreateProfilePage";
import FestivalsPage from "./pages/FestivalsPage";

import Navbar from "./Components/Navbar";
import BottomNavbar from "./Components/BottomNavbar";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";


import {Loader} from "lucide-react";
import {Toaster} from "react-hot-toast";
import SettingsPage from "./pages/SettingsPage";




const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore()
  useEffect(() => {
    checkAuth();
  }, [checkAuth])
  console.log({authUser})

  //shows loading icon when application is refreshed while its checking authentication
  if(isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"/>
    </div>
  )

  return (
    //PADDING FOR IOS AND MOBILE PHONE VIEW, MAYBE HAVE TO CHANGE
  <main data-theme="Festie">
    <Navbar />
  

    <Routes>

      {/* routes depend on if user is authenticated or not */}
      <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/>}/>
      <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/"/>}/>
      <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/"/>}/>
      <Route path="/edit-profile" element={ authUser ? <EditProfilePage/> : <Navigate to="/login"/>}/>
      <Route path="/create-profile" element={ authUser ? <CreateProfilePage/> : <Navigate to="/login"/>}/>
      <Route path="/festivals" element={ authUser ? <FestivalsPage/> : <Navigate to="/login"/>}/>
      <Route path="/settings" element={ authUser ? <SettingsPage/> : <Navigate to="/login"/>}/>

    </Routes>

    <Toaster />

    <BottomNavbar />


  </main>
)
};

export default App;