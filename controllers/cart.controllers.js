import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

export let addToCartController = async(req,res)=>{
    try
    {
        let { productid, quantity } = req.body;
        if(!productid || !quantity || quantity < 1)
        {
            return res.status(400).json({success: false, msg: "Product ID or valid quantity is required"});
        }
        let product = await productModel.findById(productid).select("price stock");
        if(!product)
        {
            return res.status(404).json({success: false, msg: "Product not found"});
        }
        if(product.stock < quantity)
        {
            return res.status(400).json({success: false, msg: "Insufficient stock"});
        }
        let itemTotalPrice = product.price * quantity;
        let updatedCart = await cartModel.findOneAndUpdate({
            user: req.user._id, "items.product": productid },
            {
                $inc: {
                    "items.$.quantity": quantity,
                    totalPrice: itemTotalPrice
                }
            },
            {
                new: true    
            }); 
            if(updatedCart)
            {
                return res.status(200).json({msg: "Cart updated successfully", success: true, cart: updatedCart});
            }
            let newCart = await cartModel.findOneAndUpdate({
                            user: req.user._id
                            },{
                            $push: {
                                items: {
                                    product: productid,
                                    quantity: quantity,
                                    price: product.price
                                }
                            },
                            $inc: {
                                totalPrice: itemTotalPrice
                            }},
                        {
                            new: true,
                            upsert: true
                        })
        return res.status(200).json({ success: true, msg: "Product added to cart successfully", cart: newCart });
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success: false, msg: "Internal server error"})
    }
}


export let updateCartController = async(req,res)=>{
    try
    {
        let { productid, quantity } = req.body;
        if(!productid || !quantity || quantity < 0)
        {
            return res.status(400).json({success: false, msg: "Product ID or valid quantity is required"});
        }
        let product = await productModel.findById(productid).select("price");
        if(!product)
        {
            return res.status(404).json({success: false, msg: "Product not found"});
        }
        let cart = await cartModel.findOne({user: req.user._id, "items.product": productid}, { "items.$": 1 });
        if(!cart)
        {
            return res.status(404).json({success: false, msg: "Product not found in cart"})
        }
        quantity = Number(quantity);
        let oldQuantity = cart.items[0].quantity;
        let priceDifference = (quantity - oldQuantity) * product.price;
        if(quantity == 0)
        {
            let updatedCart = await cartModel.findOneAndUpdate({
                user: req.user._id 
            },{
                $pull: {
                    items: {
                        product: productid
                    }
                },
                $inc: {
                    totalPrice: priceDifference
                }
            },
            {
                new: true
            })
            if(updatedCart.items.length == 0)
            {
                await cartModel.deleteOne({user: req.user._id})
            }
            return res.status(200).json({success: true, msg: "Cart updated successfuly" });

        }
        let updatedCart = await cartModel.findOneAndUpdate({
            user: req.user._id,
            "items.product": productid
        },
        {
            $set: {
                "items.$.quantity": quantity
            },
            $inc: {
                totalPrice: priceDifference
            }
        },
        {
            new: true
        });
        return res.status(200).json({success: true, msg: "Cart updated successfuly", cart: updatedCart});

    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success: false, msg: "Internal server error"})
    }
}


export let removeItemFromCartController = async(req,res)=>{
    try
    {
        let { productid } = req.body;
        if(!productid)
        {
            return res.status(400).json({success: false, msg: "Product Id is required"});
        }
        let cartItem = await cartModel.findOne({ user: req.user._id, "items.product": productid },{ "items.$": 1 });
        if(!cartItem)
        {
            return res.status(404).json({ success: false, msg: "Product not found in cart" });
        }
        const item = cartItem.items[0];
        const itemTotalPrice = item.price * item.quantity;
        let updatedCart = await cartModel.findOneAndUpdate(
            { user: req.user._id },
            {
                $pull: {
                    items: {
                        product: productid
                    }
                },
                $inc: {
                    totalPrice: -itemTotalPrice
                }
            },{
                new: true
            }
        );
        if(updatedCart.items.length == 0)
        {
            await cartModel.deleteOne({user: req.user._id})
        }
        return res.status(200).json({ success: true, msg: "Product removed from cart successfully" });
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success: false, msg: "Internal server error"})
    }
}


export let getUserCartItemsController = async(req,res)=>{
    try
    {
        let userid = req.user._id;
        let cart = await cartModel.findOne({user: userid});
        if(!cart)
        {
            return res.status(404).json({ success: false, msg: "Cart is empty" });
        }
        return res.status(200).json({ success: true, msg: "Cart items fetched successfully", cart: cart });
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
}