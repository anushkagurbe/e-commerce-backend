import mongoose from "mongoose";

let cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product"
            },
            quantity: {
                type: Number
            },
            price: {
                type: Number
            }
        }
    ],
    totalPrice: {
        type: Number
    }
});

let cartModel = mongoose.model("cart", cartSchema);

export default cartModel;