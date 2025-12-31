import mongoose, { mongo } from "mongoose";

let productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    images: [{
        type: String,
        required: true
    }]
},
{
    timestamps: true
});

let productModel = mongoose.model("product",productSchema);

export default productModel;