import moment from "moment";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
//TO DO - ADD IN PROFILE PICTURE AND PREFERENCES AND BIO

export const signup = async (req,res) => {

    // creates new user - will need to edit to capture, profile pic/bio/preferences
    const {firstName, lastName, email, password, dateOfBirth} = req.body
    try {

        if(!firstName || !lastName || !email || !password || !dateOfBirth) {
            return res.status(400).json({ message: "All fields are required"})
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters"})
        }

        const age = moment().diff(moment(dateOfBirth), 'years');

        if (age < 16) {
            return res.status(400).json({message: "You must be at least 16 years old"})
        }

        const user = await User.findOne({email})

        if (user) return res.status(400).json({message: "Email already exists"})

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            dateOfBirth: dateOfBirth,
        })

        if(newUser){
            //generate JWT toke here if user has been created, by creating a function
            generateToken(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                dateOfBirth: newUser.dateOfBirth,
                profilePic: newUser.profilePic,
                bio: newUser.bio,
                preferences: newUser.preferences,
            })

        } else {
            res.status(400).json({message: "Invalid user data"})
        }
    } catch (error) {
        console.log("Error in signup controller", error)
        res.status(500).json({message: "Internal server error"})
    }
}

export const login = async(req,res) => {
    const {email, password}=req.body
    try {
        const user = await User.findOne({email})

        if(!user) {
            return res.status(404).json({message: "Invalid Credentials"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"})
        }

        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePic: user.profilePic,
            bio: user.bio,
            preferences: user.preferences,
        })

    } catch (error) {
       console.log("Error in login controller", error.message)
       res.status(500).json({message: "Internal server error"}) 
    }
}

export const logout = (req,res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message: "Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller", error)
        res.status(500).json({message: "Internal server error"}) 
    }
}

export const updateProfile = async(req, res) => {
    try {
        const {profilePic, bio, preferences} = req.body
        const userId = req.user._id

        const currentUser = await User.findById(userId)

        const updateData = {}
        // checks if profilepic has been changed if not it won't be added to the update so it doesn't overwrite
        if(profilePic){
            //uploads image to cloudinary but not db
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        updateData.profilePic = uploadResponse.secure_url;
        }
        // checks if bio has been changed if not it won't be added to the update so it doesn't overwrite
        if (bio !== undefined) {
            updateData.bio = bio;
          }
        // checks if preferences have been changed 
        if (preferences) {
           updateData.preferences = preferences
          }
        

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No data provided to update" });
          }
      

        

        //updates database and new:true means latest updates can be seen even after they've just been applied
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {new:true})

        res.status(200).json(updatedUser)
        } catch (error) {
        console.log("error in update profile controller:", error)
        res.status(500).json({message: "Internal server error"})
    }
}

//sends the user authentication back to the client
export const checkAuth = (req,res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth controller", error.message)
        res.status(500).json({message: "Internal server error"})
    }
}