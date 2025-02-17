import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protectRoute = async (req,res,next) => {
    try {
        //calls jwt in utils.js
        const token = req.cookies.jwt

        if(!token){
            return res.status(401).json({message: "Unauthorised - No Token provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({message: "Unauthorised - Invalid Token"})
        }

        //getting user id from token but not sending password through to client
        const user = await User.findById(decoded.userId).select("-password")

        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        //adds user to the request then adds next function
        req.user = user

        next()

    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message)
        return res.status(500).json({message: "Internal server error"})
    }
}