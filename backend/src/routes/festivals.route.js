import express from "express";
import { getAllFestivals } from "../controllers/festivals.controller.js";

const router = express.Router();

router.get("/get-all-festivals", getAllFestivals )


export default router;