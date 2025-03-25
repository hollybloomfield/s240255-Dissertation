import { CalendarDays, Loader, Mail, MapPin, SlidersHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { axiosInstance } from "../lib/axios"
import moment from "moment"
import { useChatStore } from "../store/useChatStore"

const FestivalAttendeesPage = () => {
  const {festivalId} = useParams()
  const [festival, setFestival] = useState(null)
  const [attendees, setAttendees] = useState([])
  const [loading, setLoading] = useState(false)
  const {setSelectedUser} = useChatStore()
  const navigate = useNavigate()
  
  
  useEffect(() => {
    const getFestival = async () => {
      try {
        const response = await axiosInstance.get(`/festivals/get-festival`, {params: {festivalId}})
        setFestival(response.data.festival)
      } catch (error) {
        console.log("Error fetching festival info: ", error)
      }
    }
    if(festivalId){
    getFestival()}
  },[festivalId])

useEffect(() =>{
  const getAttendees = async () => {
    if (!festivalId) return;

    setLoading(true)
    try {
      const response = await axiosInstance.get("/festivals/get-attendees", {params: {festivalId}}) //using festival Id from URL
      setAttendees(response.data) //setting attendees for that festival to the API response
      
    } catch (error) {
      console.log("Error fetching festival info: ", error)
    }

    setLoading(false)
  }

  getAttendees() //calling function to get attendees
  
},[festivalId]) //only run if festival Id changes


if (!festival || loading) {
  return (
     <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin"/>
        </div>
  ) 
}









  return (
    <div className="pt-[79px] pb-[79px] w-full min-h-screen flex flex-col items-center bg-secondary/60">
    <div className="sticky top-[79px] bg-base-100 z-[5] w-full">
      <div className="flex items-start gap-4 p-2 mx-auto">
       
        <div className="flex-shrink-0">
          <img
            className="w-24 h-24 rounded-lg object-cover"
            src={festival.results.largeimageurl}
            alt="Festival"
            loading="lazy"
          />
        </div>
  
       
        <div className="flex flex-col space-y-2 flex-grow min-w-0">
          <h2 className="text-lg font-bold truncate">{festival.results.eventname}</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <CalendarDays className="h-5 w-5 text-primary flex-shrink-0" />
              <p>
                {new Date(festival.results.startdate).toLocaleDateString()} -{' '}
                {new Date(festival.results.enddate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
              <p>{festival.results.venue.town}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
<div className="w-full mx-auto p-2 space-y-3">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
    
  {attendees.length > 0 ? (
  attendees.map((user) => (
    <div key={user._id} className="card w-full bg-base-100 shadow-lg p-3">
      <div className="flex items-center justify-between gap-4">
        <div className="avatar">
          <div className="w-14 rounded-full">
            <img src={user.profilePic || "/avatar.png"} />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{user.firstName},</h2>
            <span className="font-semibold text-lg">
            {moment().diff(user.dateOfBirth, "years")}
            </span>
          </div>
        </div>
        
        <button className="btn btn-sm btn-primary"
        onClick={() => {setSelectedUser(user) //sets selected user in chat store
                        navigate("/messages") //navigates to message page
        }}
        >
          <Mail />
          Message
        </button>
      </div>

      <div className="mt-3">
        <p className="text-sm text-gray-600">{user.bio || " "}</p>
      </div>

      <div className="mt-3 flex gap-3">
        {user.preferences.accommodation && <div className="badge badge-primary">{user.preferences.accommodation}</div>}
        {user.preferences.musicGenre && <div className="badge badge-primary">{user.preferences.musicGenre}</div>}
        {user.preferences.travelMode && <div className="badge badge-primary">{user.preferences.travelMode}</div>}
      </div>
    </div>
  ))
) : (
  <p className="text-center text-primary">No attendees found.</p>
)}

  </div>
</div>
<button className="btn btn-circle btn-outline btn-primary bg-base-100 m-4 fixed bottom-[79px] right-1 shadow-lg">
  <SlidersHorizontal/>
</button>



  </div>
  )
}

export default FestivalAttendeesPage