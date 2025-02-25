import axios from "axios";
import moment from "moment";

export const getAllFestivals = async (req,res) => {
    try {
        const {limit = 20, offset = 0} = req.query
        
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
            console.log(endDate.isAfter(startDate, "day"))

            const duration = moment.duration(endDate.diff(startDate)).asHours();

            return duration > 24; 
        });

        res.status(200).json(festivals)
    } catch (error) {
        console.error("Error in getallfestivals controller:", error)
        res.status(500).json({message: "Internal server error"})
    }
}