import axios from "axios";
import moment from "moment";
import User from "../models/user.model.js";

export const getAllFestivals = async (req,res) => {
    try {
        
        const {limit = 30, offset = 0} = req.query
        
        const response = await axios.get("https://www.skiddle.com/api/v1/events/search/", {
            params: {
                api_key: process.env.SKIDDLE_API_KEY,
                eventcode: "FEST",
                country: "GB",
                limit,
                offset,
            }
        })

        const data = response.data

        if (!data) {
            return res.status(404).json({message: "No festivals found"})
        }

        const festivals = data.results.filter(festival => { 
            if (festival.cancelled === "1") return false;        
            const startDate = moment(festival.startdate);
            const endDate = moment(festival.enddate);
            

            const duration = moment.duration(endDate.diff(startDate)).asHours();

            return duration > 24; 
        });

        res.status(200).json({ festivals: festivals})
    } catch (error) {
        console.error("Error in getallfestivals controller:", error)
        res.status(500).json({message: "Internal server error"})
    }
};

export const searchFestivals = async (req,res) => {
    try {
        
        const {keyword = "", limit = 30, offset = 0} = req.query;
       
        const response = await axios.get("https://www.skiddle.com/api/v1/events/search/", {
            params: {
                api_key: process.env.SKIDDLE_API_KEY,
                eventcode: "FEST",
                country: "GB",
                limit,
                offset,
                keyword,
            }
        })

        const data = response.data

        if (!data) {
            return res.status(404).json({message: "No festivals found"})
        }

        const festivals = data.results.filter(festival => { 
            if (festival.cancelled === "1") return false;        
            const startDate = moment(festival.startdate);
            const endDate = moment(festival.enddate);
            

            const duration = moment.duration(endDate.diff(startDate)).asHours();

            return duration > 24; 
        });

        res.status(200).json({ festivals: festivals})
    } catch (error) {
        console.error("Error in searchFestivals controller:", error)
        res.status(500).json({message: "Internal server error"})
    }
    

};

export const attendingFestival = async (req,res) => {
    try {
        const {festivalId} = req.body
        

        if (!festivalId) {
            return res.status(400).json({message: "No Festival ID provided"})
        }

        if (req.user.attendingFestivals.includes(festivalId)){
            return res.status(400).json({message: "Festival is already marked as attending"})
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id, 
            { $push: { attendingFestivals: festivalId } }, 
            { new: true } 
          );

        res.status(200).json({ message: "Festival added to attending list", user: updatedUser });

        
    } catch (error) {
        console.error("Error in attendingFestival controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const notAttendingFestival = async (req,res) => {
    try {
        const {festivalId} = req.body

        if (!festivalId) {
            return res.status(400).json({message: "No Festival ID provided"})
        }
         if (!req.user.attendingFestivals.includes(festivalId)){
            return res.status(400).json({message: "Festival is not in attending list"})
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { attendingFestivals: festivalId } }, // Pull festivalId from the array and delete
            { new: true } 
        );
        res.status(200).json({ message: "Festival removed from attending list", user: updatedUser });

    } catch (error) {
        console.error("Error in notAttendingFestival controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getFestival = async (req,res) => {
    try {
        const {festivalId} = req.body

        const response = await axios.get(`https://www.skiddle.com/api/v1/events/${festivalId}/`, {
            params: {
                api_key: process.env.SKIDDLE_API_KEY,
            }
        })
            const festival = response.data

        res.status(200).json({festival})
    } catch (error) {
        console.error("Error in getFestival controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};