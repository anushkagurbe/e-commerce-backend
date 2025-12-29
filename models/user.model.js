import mongoose from "mongoose";

let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true 
    },
    password: {
        type: String,
        required: true
    },
    profileimage: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["admin","user"],
        default: "user"
    },
    gender: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});


let userModel = mongoose.model("user",userSchema);

export default userModel;



export let defaultAvatars = {
    male: "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?semt=ais_hybrid&w=740&q=80",
    female: "https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80"
}