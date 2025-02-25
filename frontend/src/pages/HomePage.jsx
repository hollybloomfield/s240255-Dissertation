import { useAuthStore } from "../store/useAuthStore"

const HomePage = () => {
  const {authUser} = useAuthStore()

  return (
    <div className="pt-[79px] w-full min-h-screen flex flex-col items-center">
      <div className="max-w-2xl w-full mx-auto p-2 space-y-3">
        <div className="text-left">
        <h1 className="text-2xl">Welcome back, {authUser.firstName}! </h1>
        </div>
        <div className="card bg-secondary/10 shadow-sm">
  <div className="card-body items-center text-center p-3">
    <h2 className="card-title">Your Festivals</h2>
    <p>User festival card</p>
    <div className="card-actions justify-end">
      <button className="btn btn-sm btn-secondary">Explore more festivals</button>
    </div>
  </div>
</div>
<div className="card bg-secondary/10 shadow-sm">
  <div className="card-body items-center text-center p-3">
    <h2 className="card-title">Festival Countdown</h2>
    <p>festival name</p>
    <p>countdown</p>
    
   
  </div>
</div>
<div className="card bg-secondary/10 shadow-sm">
  <div className="card-body items-center text-center p-3">
    <h2 className="card-title">Blog</h2>
    <div className="card-actions justify-end">
      <button className="btn btn-sm btn-secondary">Read our blog</button>
    </div>
  </div>
</div>

      </div>
    </div>
  )
}

export default HomePage