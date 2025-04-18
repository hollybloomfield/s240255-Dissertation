import {CalendarDays, Check, Loader, MapPin, Plus, SlidersHorizontal, Sparkles} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFestivalStore } from "../store/useFestivalStore";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { getCurrentUsersFestivalsAttending } from "../../../backend/src/controllers/festivals.controller";
import { useOfflineStore } from "../store/useOfflineStore";



const FestivalsPage = () => {
  const {notAttendingFestival, attendingFestival, getFestivals, isLoading, getUsersFestivalsAttending,
    festivals, hasMore, resetFestivalList, searchFestivals, isSearching, festivalsAttending} = useFestivalStore();
  const {isOffline} = useOfflineStore()
  const observer = useRef(null);
  const [keyword, setKeyword] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOffline) {
      getUsersFestivalsAttending()
    }
    
 }, [getUsersFestivalsAttending, isOffline])

  useEffect(() => {
    if (!isOffline) {
      getFestivals(); // get festivals on component mount
    }
    
  }, [getFestivals, isOffline]);

  useEffect(() => {
    return () => {
      resetFestivalList(); // Clear festival list when navigating to another page
    };
  }, []);

  const lastFestivalRef = useCallback((node) => {
    if (isLoading || isSearching || isOffline) return;

    if (observer.current) observer.current.disconnect() //removes any observers to avoid duplication

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) { //check if last festival is visible and if there are more to load
        getFestivals(); //API call
      }
    })

    if (node) observer.current.observe(node) //attach observer to the last festival item


    }, [isLoading, hasMore, getFestivals, isOffline])

  const handleSearchSubmit = async (e) => {
    e.preventDefault()
    if (!isOffline) {
    await searchFestivals(keyword)
    window.scrollTo({
      top: 0,
      behavior: 'smooth', 
    });
  }
  }
  

  const handleAttendanceClick = async(e, festival, isAttending) => {
      e.preventDefault()
      
        if (isAttending) {
   
        await notAttendingFestival(festival.id)
        
      } else {
       
        await attendingFestival(festival)
      
      }
     

    

  }
 
  const handleUsersAttendingClick = async(festivalId) => {
    navigate(`/festivals/${festivalId}/attendees`)
  }
  
 



  return (
    <div className="pt-[79px] pb-[79px] w-full min-h-screen flex flex-col items-center bg-secondary/80">
    
    <div className="sticky top-[78px] bg-base-100 z-[5] w-full"> 
      <div className="flex gap-0.5 p-1">
      <form onSubmit={handleSearchSubmit} className="flex w-full">
        <label className="input input-bordered flex items-center gap-2 w-full">
  <input 
    type="text" 
    className="grow" 
    placeholder="Search Festivals"
    value={keyword}
    onChange={(e) => setKeyword(e.target.value)} />
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70"
    onClick={handleSearchSubmit}>
    <path
      fillRule="evenodd"
      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
      clipRule="evenodd" />
  </svg>
</label>
</form>
      <button className="btn btn-square btn-ghost">
        <SlidersHorizontal/>
      </button>
      </div>

      <div className="text-center bg-accent w-full">
        <h1 className="text-xl text-black">Upcoming Festivals </h1>
        </div>
</div> 
<div className=" w-full mx-auto p-2 space-y-3">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">



{isOffline ? (
  <p className="text-center text-lg text-primary">You are currently offline. Please go online to view festivals.</p>
) : (
  festivals.map((festival, index) => { 
    const isAttending = festivalsAttending?.some(f => String(f.festivalId) === String(festival.id));
    
    return(
      <div 
        key={festival.id}
        ref={index === festivals.length - 1 ? lastFestivalRef : null}
        className="card w-full sm:w-80 max-w-xs bg-base-100 shadow-lg">
        
        <figure className="px-4 pt-4 flex justify-center">
          <div className="w-48">
            <img
              className="rounded-lg w-full aspect-square object-cover"
              src={festival.largeimageurl}
              alt="Festival"
              loading="lazy"
            />
          </div>
        </figure>

        <div className="card-body p-4 bg-secondary/10 rounded-lg">
          <div className="flex flex-wrap justify-between gap-2">
            <h2 className="card-title text-xl font-bold">{festival.eventname}</h2>

            <button
              className={`btn btn-sm rounded-full ${isAttending ? ' btn-accent ' : 'btn-secondary'}`}
              onClick={(e) => handleAttendanceClick(e, festival, isAttending)}
            >
              {isAttending ? (
                <>
                  <Check className="w-5" />Attending
                </>
              ) : (
                <>
                  <Plus className="w-5" />Attend
                </>
              )}
            </button>
          </div>
          
          <div className="flex flex-col flex-grow gap-2 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <p>{new Date(festival.startdate).toLocaleDateString()} - {new Date(festival.enddate).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <p>{festival.venue.town}</p>
            </div>
          </div>

          <div className="card-actions mt-3 justify-center">
            <button 
              className="btn btn-outline btn-sm btn-primary bg-base-100 rounded-full"
              onClick={() => handleUsersAttendingClick(festival.id)}>
              See Who's Going!
            </button>
          </div>
        </div>
      </div>
    );
  })
)}

</div>

 {isLoading &&  <div className="flex items-center justify-center gap-1 text-primary">
  <Loader className="size-5 animate-spin "/>
  <p>Loading festivals</p>
  </div>}



{!hasMore && !isLoading && <p className="text-center">No more results</p>}

    </div>
  </div>
  )
}

export default FestivalsPage