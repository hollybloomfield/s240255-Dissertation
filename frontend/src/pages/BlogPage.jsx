import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { axiosInstance } from "../lib/axios"
import DOMPurify from "dompurify"
import {formatBlogDate} from "../lib/utils"
import { ArrowLeft } from "lucide-react"

const BlogPage = () => {
    const {blogId} = useParams()
    const [blogContent, setBlogContent] = useState([])
    const navigate = useNavigate()
  
    useEffect(() => {
      const getBlogContent = async () => {
        try {
            const response = await axiosInstance.get(`/blog/get-blog-content`, {params: {blogId}})
        
            setBlogContent(response.data)
        } catch (error) {
            console.log("Error getting blog content:", error)
        }
      }
      getBlogContent()
    }, [])

    
  return (
    <div className="pt-[79px] pb-[79px] w-full min-h-screen items-center flex flex-col">
     
    
    <button
      className="btn btn-ghost flex items-center self-start"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft className="size-4 mr-1" />
      Back
    </button>
  
          
        <div className="max-w-2xl w-full mx-auto p-4 pt-0 space-y-4">

        
            <h1 className="text-2xl font-bold">{blogContent.title}</h1>
            <p className="text-sm text-gray-500">By {blogContent.author}</p>
        </div>

        <div className="w-full px-2 max-w-2xl">
        <div className="h-48 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
            <img
            src={blogContent.image}
            className="object-cover w-full h-full"
            alt={blogContent.title}
            />

        </div>
        </div>
        <div className="px-3 pt-4 items-center justify-center max-w-2xl">
        <div className="text-base"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blogContent.content) }}>
        {/* ensures the HTML stored in the database is rendered properly and is secure from XSS attacks */}
        </div>
        </div>
        <div className="text-xs mt-3 text-gray-500">
            Updated {formatBlogDate(blogContent.updatedAt)}
        </div>
    </div>
  )
}

export default BlogPage