import express from "express";
import { getAllFestivals, searchFestivals } from "../controllers/festivals.controller.js";

const router = express.Router();

router.get("/get-all-festivals", getAllFestivals )
router.get("/search-festivals", searchFestivals)


export default router;