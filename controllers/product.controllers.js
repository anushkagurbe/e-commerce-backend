import { uploadOnCloudinary } from "../config/cloudinary.js";
import productModel from "../models/product.model.js";
import categoryModel from "../models/category.model.js";

export let createProductController = async(req,res)=>{
    try
    {
        let { name, description, price, stock, category } = req.body;
        if(!name || !description || !category || price==null || stock==null) 
        {
            return res.status(400).json({success: false, msg: "All fields are required"});
        }
        if(!req.files || req.files?.length == 0)
        {
            return res.status(400).json({success: false, msg: "Product images are required"});
        }
        let cloudinaryImageUrls = [];
        for(let file of req.files)
        {
            let uploadedImage = await uploadOnCloudinary(file.path);
            if(!uploadedImage?.url)
            {
                return res.status(500).json({success: false, msg: "Image upload failed"});
            }
            cloudinaryImageUrls.push(uploadedImage.url);
        }
        let product = await productModel.create({
            name: name,
            description: description,
            price: price,
            stock: stock,
            category: category,
            images: cloudinaryImageUrls
        })
        return res.status(201).json({success: true, msg: "Product added successfully", product: product});
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success: false, msg: "Internal server error"});
    }
}

export let getProductsCategorywiseController = async(req,res)=>{
    try
    {
        let catid = req.params.catid;
        if(!catid)
        {
            return res.status(400).json({success: false, msg: "Category ID id required"});   
        }
        let isCategory = await categoryModel.findOne({_id: catid});
        if(!isCategory)
        {
            return res.status(404).json({success: false, msg: "Category not found"});
        }
        let products = await productModel.find({category: catid});
        if(products.length == 0)
        {
            return res.status(404).json({success: false, msg: "Products not found"});
        }
        return res.status(200).json({success: true, msg: "Products fetched successfully", products: products});
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success: false, msg: "Internal server error"});
    }
}


export let getAllProductsController = async(req,res)=>{
    try
    {
        let page = parseInt(req.query?.page) || 1;
        let limit = parseInt(req.query?.limit) || 2;
        let allProductsQuantity = await productModel.find();
        if(allProductsQuantity == 0)
        {
            return res.status(404).json({success: false, msg: "Products not found"});
        }
        let products = await productModel.find().limit(limit).skip((page - 1) * limit);
        if(!products)
        {
            return res.status(404).json({success: false, msg: "Products are over"});
        }
        return res.status(200).json({success: true, msg: "Products fetched successfully", products: products});
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success: false, msg: "Internal server error"});
    }
}