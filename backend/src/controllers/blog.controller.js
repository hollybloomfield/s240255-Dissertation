import axios from "axios";
import Blog from "../models/blog.model.js";

export const getBlogs = async (req,res) => {
    try {
        const blogs = await Blog.find().select("title image") //only select title and image
       
        res.status(200).json(blogs)
    } catch (error) {
        console.log("Error in getBlogs:", error)
        res.status(500).json({error: "Internal server error"})
    }
};

export const getBlogContent = async (req,res) => {
    try {
        const {blogId} = req.query //get id from frontend
       
        const blogContent = await Blog.findById(blogId).select() //select everything

        res.status(200).json(blogContent)
    } catch (error) {
        console.log("Error in getBlogContent:", error)
        res.status(500).json({error: "Internal server error"})
    }
};