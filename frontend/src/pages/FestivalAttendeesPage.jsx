import { CalendarDays, MapPin } from "lucide-react"

const FestivalAttendeesPage = () => {




  return (
    <div className='pt-[79px] pb-[79px] w-full min-h-screen flex flex-col items-center bg-secondary/60'>
         <div className="sticky top-[79px] bg-base-100 z-[5] w-full">
            <div className="flex">
            <img
      className="object-cover"
      src="https://d31fr2pwly4c4s.cloudfront.net/d/9/9/1711298_796c7abf_revival-indoor-music-festival-weekender-2025_th.jpg"
      alt="Festival"
      loading="lazy"/>
    
             <div className="flex flex-col items-center space-x-4 pt-2">   
                <div className="text-xl">Festival name</div>
                <div className="flex flex-grow gap-4 text-sm">
      <div className="flex items-center gap-1">
        <CalendarDays className="h-5 w-5 text-gray-500" />
        <p>date </p>
      </div>
      <div className="flex items-center gap-1">
        <MapPin className="h-5 w-5 text-gray-500" />
        <p>location</p>
      </div>
    </div>

        </div> 
        </div> 
        </div>


    </div>
  )
}

export default FestivalAttendeesPage