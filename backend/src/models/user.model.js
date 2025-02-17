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
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;