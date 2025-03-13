import { Users } from "lucide-react";

const ChatListSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full w-full sm:w-80 
    flex flex-col transition-all duration-200 sm:border-r sm:border-primary"
    >
      {/* Header */}
      <div className="flex flex-col">
      <div className="border-b border-primary w-full p-1 bg-base-100/50">
        <div className="flex items-center gap-3 text-primary">
          <Users className="w-6 h-6" />
          <span className="font-semibold">Messages</span>
        </div>
      </div>

    
        <label className="input input-bordered border-primary flex items-center gap-2 h-8 bg-base-100 m-1">
  <input 
    type="text" 
    className="grow" 
    placeholder="Search Messages"
     />
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70 text-primary"
   >
    <path
      fillRule="evenodd"
      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
      clipRule="evenodd" />
  </svg>
</label>

</div>
      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-1 ">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-14 rounded-full bg-secondary" />
            </div>

           
            <div className="text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-3 bg-secondary" />
              <div className="skeleton h-3 w-52 bg-secondary" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ChatListSkeleton;