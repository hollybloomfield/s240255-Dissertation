import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { ArrowLeft, Camera, Car, Loader2, MessageCircle, Music, Tent } from "lucide-react";
import { useNavigate } from "react-router-dom";


const EditProfilePage = () => {
  const navigate = useNavigate()
  const {authUser, isUpdatingProfile, updateProfile } = useAuthStore()
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(authUser.profilePic || "/avatar.png")
  const [bio, setBio] = useState(authUser.bio || "")
  const [preferences, setPreferences] = useState({
    accommodation: authUser.preferences.accommodation || "",
    travelMode: authUser.preferences.travelMode || "",
    musicGenre: authUser.preferences.musicGenre || "",
}
  )

  const preferencesOptions = {
    accommodation: ['Camping', "Glamping" , "Hotel" , "Campervan", "Day Trip"],
    travelMode: ["Drive myself", "Rideshare", "Train", "Coach"],
    musicGenre: ["EDM","Rock","Pop","Hip-Hop","Indie","Open to anything"],
  } 

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()

      reader.readAsDataURL(file)

      reader.onload = async () => {
        const base64Image = reader.result
        setSelectedImage(base64Image)
        setPreviewImage(URL.createObjectURL(file))
      }
     
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await updateProfile({
      profilePic: selectedImage,
      bio: bio,
      preferences: {
        accommodation: preferences.accommodation,
        travelMode: preferences.travelMode,
        musicGenre: preferences.musicGenre,
      }
    })
  }


  return (
    <div className="w-full min-h-screen bg-secondary/80  flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-4 py-4">
        <div className="p-4 space-y-8 card card-compact bg-base-100 w-full shadow-xl">
        
          <div className="text-center">
            <button className="btn btn-ghost flex items-center" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4" />Back
          </button>
          <h1 className="text-2xl font-semibold">Edit Profile</h1>
          <p className="mt-2">Hello, {authUser.firstName}!</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="form-control">
              <div className="flex flex-col items-center">
                <div className="relative">
                <div className="avatar">
                  <div className="ring-primary ring-offset-base-100 w-32 rounded-full ring ring-offset-2">
                    <img src={previewImage} />
                  </div>
                </div>
                  <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-primary hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200">
                    <Camera className="w-5 h-5 text-base-200"/>
                  <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}>
                  </input>
                  </label>
                </div>
             
              </div>
              
            </div>

            <div className="form-control">
            <label>
            <div className="text-sm ml-1">
                  <p>Bio</p>
                </div>
            </label>
            <textarea 
            className="textarea textarea-primary" 
            value={bio} 
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write about yourself..."
            maxLength={150}></textarea>
            </div>
            <div className="text-center font-semibold border-b border-secondary">
             <h1 className="mb-1">Preferences</h1>
            </div>
            
            <div className="form-control">
              <label>
                <div className="flex space-x-1 text-sm">
                  <Tent className="size-5"/>
                  <p>Accommodation</p>
                </div>        </label>
        <div className="text-center space-x-4 space-y-2">
          {preferencesOptions.accommodation.map((option) => (
            <button
              type="button"
              key={option}
              onClick={(e) => {
              
                //checks if option selected is same as before and sets it to null and deselects
                const newAccommodation = preferences.accommodation === option ? "" : option;              
                setPreferences({ ...preferences, accommodation: newAccommodation });
             
              }}
              className={`btn btn-sm  btn-primary px-4 py-1  rounded-full
              ${preferences.accommodation === option ? 'btn-active' : 'btn-outline'}`}
            >
              {option}
            </button>
          ))}
        </div>

      </div>

      <div className="form-control">
              <label>
                <div className="flex space-x-1 text-sm">
                  <Car className="size-5"/>
                  <p>Travel Mode</p>
                </div> 
              </label>
        <div className="text-center space-x-4 space-y-2">
          {preferencesOptions.travelMode.map((option) => (
            <button
              className={`btn btn-sm btn-primary px-4 py-1 rounded-full
              ${preferences.travelMode === option ? 'btn-active' : ' btn-outline'}`}
              type="button"
              key={option}
              onClick={(e) => {
              
                //checks if option selected is same as before and sets it to null and deselects
                const newTravelMode = preferences.travelMode === option ? "" : option;              
                setPreferences({ ...preferences, travelMode: newTravelMode });
              
              }}
            >
              {option}
            </button>
          ))}
        </div>
       
      </div>

      <div className="form-control">
              <label>
                <div className="flex space-x-1 text-sm">
                  <Music className="size-5"/>
                  <p>Music Genre</p>
                </div> 
              </label>
        <div className="text-center space-x-4 space-y-2">
          {preferencesOptions.musicGenre.map((option) => (
            <button
              className={`btn btn-sm btn-primary px-4 py-1  rounded-full
              ${preferences.musicGenre === option ? 'btn-active' : ' btn-outline'}`}
              type="button"
              key={option}
              onClick={(e) => {
               
                //checks if option selected is same as before and sets it to null and deselects
                const newMusicGenre = preferences.musicGenre === option ? "" : option;              
                setPreferences({ ...preferences, musicGenre: newMusicGenre });
                
              }}
            >
              {option}
            </button>
          ))}
        </div>
       
      </div>
      <div className="pt-1 flex justify-center">
              <button type="submit" className="btn btn-primary rounded-full w-64 text-lg" disabled={isUpdatingProfile} >
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : ("Save Changes")}
              </button>
              </div>
           



          </form>


        </div>
      </div>

    </div>
  )
}

export default EditProfilePage