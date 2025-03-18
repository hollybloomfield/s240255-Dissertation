import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getChatUsers, getMessages, sendMessage } from "../controllers/messages.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getChatUsers)
router.get("/:id", protectRoute, getMessages)
router.post("/send/:id", protectRoute, sendMessage)

export default router;