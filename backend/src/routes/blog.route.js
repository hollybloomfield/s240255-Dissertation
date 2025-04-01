import express from "express";
import { getBlogContent, getBlogs } from "../controllers/blog.controller.js";

const router = express.Router()

router.get("/get-blogs", getBlogs)
router.get("/get-blog-content", getBlogContent)

export default router;