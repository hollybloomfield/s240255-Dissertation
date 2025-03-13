import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getActiveChatsUsers } from "../controllers/messages.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getActiveChatsUsers)

export default router;