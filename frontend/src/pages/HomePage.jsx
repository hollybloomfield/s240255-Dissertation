import { useEffect, useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { useFestivalStore } from "../store/useFestivalStore"
import { useNavigate } from "react-router-dom"
import { axiosInstance } from "../lib/axios"
import {Link} from "react-router-dom"

const HomePage = () => {
  const {authUser} = useAuthStore()
  const {getUsersFestivalsAttending, festivalsAttending} = useFestivalStore()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(null)
  const [nextFestival, setNextFestival] = useState(null)
  const [blogs, setBlogs] = useState([])

 
    useEffect(() => {
      const getBlogs = async () => {
        try {
          const response = await axiosInstance.get("/blog/get-blogs")

          setBlogs(response.data) //set blogs to data from API
        } catch (error) {
          console.log("Error getting blogs:", error)
        }
      }
      getBlogs()
    }, [])
    
    useEffect(() => {
       getUsersFestivalsAttending()
    }, [getUsersFestivalsAttending])

   const calculateCountdown = (startDate) => {
    const currentDate = new Date()
    const festivalDate = new Date(startDate)
    const timeDifference = festivalDate - currentDate

    if (timeDifference > 0) {
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) //calculates days, hours, mins, seconds using the time 
                                                                      //difference calulated comparing startdate to current date
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)
      return { days, hours, minutes, seconds } 
    }

    return null
   }

   //starts countdown timer that updates every second
   const startCountdown = (startDate) => {
    const interval = setInterval(() =>{
      setCountdown(calculateCountdown(startDate)) //updates countdown state
    }, 1000) //runs every 1 second

    return interval
   }

   
   useEffect(() => {
    if (festivalsAttending.length > 0) {
      const nextFest = festivalsAttending[0] //get first festival in array (already sorted)
      setNextFestival(nextFest) //set festival details
      setCountdown(calculateCountdown(nextFest.startDate)) // Calculate countdown

      const interval = startCountdown(nextFest.startDate) //start interval countdown

      return () => clearInterval(interval) //clear interval 
    }
  }, [festivalsAttending])
 
    const handleUsersAttendingClick = async(festivalId) => {
      navigate(`/festivals/${festivalId}/attendees`)
    }

    const handleBlogClick = async (blogId) => {
      navigate(`/blog/${blogId}`)
    }

    const handleExploreFestivalsClick = async() => {
      navigate("/festivals")
    }






  return (
    <div className="pt-[79px] pb-[79px] w-full min-h-screen flex flex-col items-center">
      <div className="max-w-2xl w-full mx-auto p-2 space-y-3">
        <div className="text-left">
        <h1 className="text-2xl">Welcome back, {authUser.firstName}!</h1>
        </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="card bg-secondary/10 shadow-sm flex-1">
  <div className="card-body items-center text-center p-2">
    <h2 className="card-title">Your Festivals</h2>
    {festivalsAttending.length > 0 && (
  <div className="w-full p-1 max-h-[200px] overflow-y-auto bg-base-100 rounded-lg">
    {festivalsAttending.map((festival) => (
      <div key={festival.festivalId} className="border-b border-base-300">
        <div className="flex items-center gap-4 justify-between p-3">
          <div className="flex items-center gap-2">
            <img
              src={festival.image}
              alt={festival.eventname}
              className="w-12 h-12 object-cover rounded-md"
            />
            <p className="text-sm">{festival.eventname}</p>
          </div>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => handleUsersAttendingClick(festival.festivalId)}
          >
            Find Friends!
          </button>
        </div>
      </div>
    ))}
  </div>
)}

    
  {festivalsAttending.length === 0 && (
    <div className="card-actions justify-end">
      <button className="btn btn-sm btn-secondary"
      onClick={handleExploreFestivalsClick}>Discover Festivals Here!</button>
    </div> 
  )}
  </div>
</div>

{nextFestival && countdown ? (
          <div className="card bg-secondary/10 shadow-sm flex-1 h-auto sm:h-[150px] justify-center">
            <div className="card-body items-center text-center justify-center p-3">
              
              <p className="font-semibold">{nextFestival.eventname} Countdown</p>

              
              <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
                <div className="flex flex-col p-2 bg-primary/70 rounded-box text-neutral-content">
                  <span className="countdown text-4xl">
                    <span style={{ "--value": countdown.days }}></span>
                  </span>
                  days
                </div>
                <div className="flex flex-col p-2 bg-secondary rounded-box text-neutral-content">
                  <span className="countdown text-4xl">
                    <span style={{ "--value": countdown.hours }}></span>
                  </span>
                  hours
                </div>
                <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                  <span className="countdown text-4xl">
                    <span style={{ "--value": countdown.minutes }}></span>
                  </span>
                  min
                </div>
                <div className="flex flex-col p-2 bg-accent rounded-box text-neutral-content">
                  <span className="countdown  text-4xl">
                    <span style={{ "--value": countdown.seconds }}></span>
                  </span>
                  sec
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className=" hidden card bg-secondary/10 shadow-sm">
           
          </div>
        )}</div>


<div className="card bg-secondary/10 shadow-sm ">
  <div className="card-body items-center text-center p-2">
    <h2 className="card-title">Festie Blog</h2>
   
    <div className="flex flex-col gap-4 max-h-[300px] sm:max-h-[600px] overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {blogs.map((blog) => (
          <button 
          key={blog._id} 
          className="btn btn-ghost relative w-full h-48 rounded-lg"
          onClick={() => handleBlogClick(blog._id)}>
    <img src={blog.image} 
    alt={blog.title} 
    className="w-full h-48 object-cover rounded-lg"
    />
    <div className="absolute bg-black bg-opacity-30 rounded-sm max-w-[250px]">
        <h3 className="text-white text-xl font-semibold text-center px-2">{blog.title}</h3>
      </div>
  </button> 
        ))}
        </div>
</div>

   
  </div>
</div>

      </div>
    </div>
  )
}

export default HomePage