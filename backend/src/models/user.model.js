import mongoose from "mongoose";
import moment from "moment";

const userSchema = new mongoose.Schema(
    {
        email: {
            type:String,
            required: true,
            unique: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        profilePic: {
            type: String,
            default: "",        
        },
        dateOfBirth: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                  const age = moment().diff(moment(value), 'years');
                  return age >= 16; // Minimum age of 16
                },
                message: 'You must be at least 16 years old to register.',
              },
        },
        bio: {
            type: String,
            default: "",
        },
        preferences: {
            accommodation: {
                type: String,
                enum: ['Camping', "Glamping" , "Hotel" , "Campervan", "Day Trip", ""],
                default: "",
            },

            travelMode: {
                type: String,
                enum: ["Drive myself", "Rideshare", "Train", "Coach", ""],
                default: "",
            },

            musicGenre: {
                type: String,
                enum: ["EDM","Rock","Pop","Hip-Hop","Indie","Open to anything", ""],
                default: "",

            },
        },
        attendingFestivals: {
            type: [String],
            default: []
        },
        blockedUsers: {
            type: [mongoose.Schema.Types.ObjectId],
            default: [],
        },     
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;