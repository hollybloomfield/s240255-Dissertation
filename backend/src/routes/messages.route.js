import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { blockUser, getChatUsers, getMessages, sendMessage, unblockUser, getBlockedUsers } from "../controllers/messages.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getChatUsers)
router.get("/:id", protectRoute, getMessages)
router.post("/send/:id", protectRoute, sendMessage)
router.post("/block/:id", protectRoute, blockUser)
router.delete("/unblock/:id", protectRoute, unblockUser)
router.get("/blocked-users/get", protectRoute, getBlockedUsers)



export default router;