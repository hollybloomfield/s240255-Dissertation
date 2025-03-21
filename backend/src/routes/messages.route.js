import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getChatUsers, getMessages, newChat, sendMessage } from "../controllers/messages.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getChatUsers)
router.get("/:id", protectRoute, getMessages)
router.post("/send/:id", protectRoute, sendMessage)
router.post("/new-chat/:id", protectRoute, newChat)

export default router;