import express from "express";
import { attendingFestival, getAllFestivals, getAttendees, getFestival, notAttendingFestival, searchFestivals } from "../controllers/festivals.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/get-all-festivals", getAllFestivals )
router.get("/search-festivals", searchFestivals)
router.post("/attending-festival", protectRoute, attendingFestival)
router.delete("/not-attending-festival", protectRoute, notAttendingFestival)
router.get("/get-festival", getFestival)
router.get("/get-attendees", protectRoute, getAttendees)



export default router;