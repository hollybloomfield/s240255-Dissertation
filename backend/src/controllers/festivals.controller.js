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
        console.log("Error in getallfestivals controller:", error)
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
        console.log("Error in searchFestivals controller:", error)
        res.status(500).json({message: "Internal server error"})
    }
    

};

export const attendingFestival = async (req,res) => {
    try {
        const {festival} = req.body

         if (!festival) {
            return res.status(400).json({message: "No Festival ID provided"})
        }

        const {
            id: festivalId,
            eventname,
            venue: { town },
            imageurl: image,
            startdate,
            enddate
        } = festival; //deconstructing festival from request

        if (req.user.attendingFestivals.some(f => f.festivalId === festivalId)) {
            return res.status(409).json({ message: "Festival is already marked as attending" });
        } //check if festival already exists in current users collection

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id, 
            { $push: { attendingFestivals: { 
                festivalId, 
                eventname, 
                location: town, 
                image, 
                startDate: new Date(startdate), 
                endDate: new Date(enddate) 
            }  //add festival data to attendingFestivals array in collection
        },
    }, 
            { new: true } 
          );
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in attendingFestival controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const notAttendingFestival = async (req,res) => {
    try {
        const {festivalId} = req.body

        
         if (!req.user.attendingFestivals.some(f => f.festivalId === festivalId)){
            return res.status(409).json({message: "Festival is not in attending list"})
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { attendingFestivals: {festivalId: festivalId }} }, // if festival id matches, 
                                                                        // Pull whole object from the array and delete
            { new: true } 
        );
       
        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in notAttendingFestival controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getFestival = async (req,res) => {
    try {
        const {festivalId} = req.query

        const response = await axios.get(`https://www.skiddle.com/api/v1/events/${festivalId}/`, {
            params: {
                api_key: process.env.SKIDDLE_API_KEY,
            }
        })
            const festival = response.data

        res.status(200).json({festival})
    } catch (error) {
        console.log("Error in getFestival controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAttendees = async (req,res) => {
    try {
        const {festivalId} = req.query //gets Festival Id from the request
        const userId = req.user._id //gets current user Id from the request
    
        const attendees = await User.find(
            {"attendingFestivals.festivalId": festivalId, _id: { $ne: userId }}, //finds users which match festival Id in Attending festivals
                                                                    //removes current user from response 
            {email: 0, password:0}                                  //does not send email or password in the response
        )

        res.status(200).json(attendees) //response contains array of attendees found in user database
    } catch (error) {
        console.log("Error in getAttendees controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getCurrentUsersFestivalsAttending = async (req,res) => {
    try {
        const loggedInUserId = req.user._id

        const currentDate = new Date() //variable for current date

        const user = await User.findById(loggedInUserId)
        .select("-password") 
       
        const filteredUserFestivals = user.attendingFestivals.filter(festival =>
            new Date(festival.endDate) >= currentDate
        ) //only return users festival if the end date is in the future of the current date

        const sortedUserFestivals = filteredUserFestivals.sort((a,b) => new Date(a.startDate) - new Date(b.startDate))
        //sort festivals according to start date
        res.status(200).json(sortedUserFestivals)
    } catch (error) {
        console.log("Error in getCurrentUsersFestivalsAttending controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}