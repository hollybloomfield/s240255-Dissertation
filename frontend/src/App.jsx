import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EditProfilePage from "./pages/EditProfilePage";
import CreateProfilePage from "./pages/CreateProfilePage";
import FestivalsPage from "./pages/FestivalsPage";
import MessagesPage from "./pages/MessagesPage";

import Navbar from "./Components/Navbar";
import BottomNavbar from "./Components/BottomNavbar";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";


import {Loader} from "lucide-react";
import {Toaster} from "react-hot-toast";
import SettingsPage from "./pages/SettingsPage";
import FestivalAttendeesPage from "./pages/FestivalAttendeesPage";
import { useChatStore } from "./store/useChatStore";
import { useThemeStore } from "./store/useThemeStore";
import { useFestivalStore } from "./store/useFestivalStore";
import BlogPage from "./pages/BlogPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";




const App = () => {
  const {authUser, checkAuth, isCheckingAuth, subscribeToNotifications, unsubscribeFromNotifications, checkIfOffline} = useAuthStore()
  const {subscribeToBlock, unsubscribeFromBlock} = useChatStore()
  const {theme} = useThemeStore()

  useEffect(() => {
    if(authUser){
    subscribeToBlock(); 
    }
    return () => {
      unsubscribeFromBlock(); // Unsubscribe when component unmounts
  };
    }, [subscribeToBlock, unsubscribeFromBlock, authUser])

  useEffect(() => {
    checkAuth();
  }, [checkAuth, useLocation()])

  useEffect(() => {
    const removeOfflineEventListeners = checkIfOffline()

    return removeOfflineEventListeners
  }, [])


  useEffect(() => {
    if (authUser) { //subscribes to notifications across the whole application if user is logged in
        subscribeToNotifications();
    }

    return () => {
        unsubscribeFromNotifications(); // Unsubscribe when component unmounts
    };
}, [authUser]);
  

  //shows loading icon when application is refreshed while its checking authentication
  if(isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"/>
    </div>
  )

  return (
    //PADDING FOR IOS AND MOBILE PHONE VIEW, MAYBE HAVE TO CHANGE
  <main data-theme={theme}>
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
      <Route path="/festivals/:festivalId/attendees" element={ authUser ? <FestivalAttendeesPage/> : <Navigate to="/login"/>}/>
      <Route path="/messages" element={ authUser ? <MessagesPage/> : <Navigate to="/login"/>}/>
      <Route path="/blog/:blogId" element={ authUser ? <BlogPage/> : <Navigate to="/login"/>}/>
      <Route path="/settings/change-password" element={ authUser ? <ChangePasswordPage/> : <Navigate to="/login"/>}/>

    </Routes>

    <Toaster />

    <BottomNavbar />


  </main>
)
};

export default App;