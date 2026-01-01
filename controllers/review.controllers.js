import reviewModel from "../models/review.model.js";

export let addReviewController =async(req,res)=>{
    try
    {
        let { rating, comment } = req.body;
        let { productid } = req.params;
        if(!rating || !comment)
        {
            return res.status(400).json({success: false, msg: "All fields are required"});
        }
        let review = await reviewModel.create({
            user: req.user._id,
            rating: rating,
            comment: comment,
            product: productid
        });
        return res.status(201).json({success: true, msg: "Your review has been submitted", review: review});
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success: false, msg: "Internal server error"});
    }
}

export let getProductReviewsController = async(req,res)=>{
    try
    {
        let { productid } = req.params;
        if(!productid)
        {
            return res.status(400).json("Product Id is required");
        } 
        let reviews = await reviewModel.find({product: productid});
        if(!reviews)
        {
            return res.status(404).json({success: false, msg: "Reviews not found"});
        }
        return res.status(200).json({success: true, msg: "Reviews fetched successfully", reviews: reviews});
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success: false, msg: "Internal server error"});
    }
}


export let deleteReviewController = async(req,res)=>{
    try
    {
        let { reviewid } = req.params;
        if(!reviewid)
        {
            return res.status(400).json({success: false, msg: "Review Id is required"});
        } 
        let review = await reviewModel.findById(reviewid).select("_id");
        if(!review)
        {
            return res.status(404).json({success: false, msg: "Review not found"});
        }
        if(review._id.toString() !== req.user._id.toString())
        {
            return res.status(401).json({success: false, msg: "Unauthorized user"});
        }
        await reviewModel.deleteById(reviewid);
        return res.status(200).json({success: true, msg: "Review deleted successfully"});
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success: false, msg: "Internal server error"});
    }
}