import mongoose from "mongoose";

let categorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
},
{
    timestamps: true
});

let categoryModel = mongoose.model("category",categorySchema);

export default categoryModel;