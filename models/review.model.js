import mongoose from "mongoose";

let reviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

let reviewModel = mongoose.model("review", reviewSchema);

export default reviewModel;