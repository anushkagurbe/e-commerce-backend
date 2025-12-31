import categoryModel from "../models/category.model.js";

export let addCategoryController = async(req,res)=>{
    try
    {
        let { categoryName, description } = req.body;
        if(!categoryName || !description)
        {
            return res.status(400).json({success: false, msg: "All fields are required"});
        }
        let isCategoryExist = await categoryModel.findOne({categoryName: categoryName.toLowerCase()}).select("_id");
        if(isCategoryExist)
        {
            return res.status(400).json({success: false, msg: "Category already exists"});
        }
        let category = await categoryModel.create({categoryName: categoryName.toLowerCase(), description});
        return res.status(201).json({success: true, msg: "Category created successfully", category: category});
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({success: false, msg: "Internal server error"});
    }
}

export let getAllCategoriesController = async(req,res)=>{
    try
    {
        let categories = await categoryModel.find();
        if(categories.length == 0)
        {
            return res.status(404).json({success: false, msg: "Categories not found"})
        }
        return res.status(200).json({success: true, msg: "Categories fetched successfully", categories: categories});
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({success: false, msg: "Internal server error"});  
    }
}

export let getSingleCategoryController = async(req,res)=>{
    try
    {
        let catid = req.params.catid;
        if(!catid)
        {
            return res.status(400).json({success: false, msg: "Category ID is required"})
        }
        let category = await categoryModel.findById(catid);
        if (!category) 
        {
            return res.status(404).json({ success: false, msg: "Category not found" });
        }
        return res.status(200).json({success: true, msg: "Category fetched successfully", category: category});
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({success: false, msg: "Internal server error"});  
    }
}

export let updateCategoryController = async(req,res)=>{
    try
    {
        let catid = req.params.catid;
        if(!catid)
        {
            return res.status(400).json({success: false, msg: "Category ID is required"})
        }
        let {categoryName, description} = req.body;

        if(!categoryName || !description)
        {
            return res.status(400).json({success: false, msg: "All fields are required"});
        }
        categoryName = categoryName.trim().toLowerCase();
        let updatedCategory = await categoryModel.findByIdAndUpdate(catid, { categoryName, description },{ new: true });
        if (!updatedCategory) 
        {
            return res.status(404).json({ success: false, msg: "Category not found" });
        }
        return res.status(200).json({success: true, msg: "Category updated successfully", category: updatedCategory});
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({success: false, msg: "Internal server error"});  
    }
}

export let deleteCategoryController = async(req,res)=>{
    try
    {
        let catid = req.params.catid;
        if(!catid)
        {
            return res.status(400).json({success: false, msg: "Category ID is required"})
        }
        let deletedCategory = await categoryModel.findByIdAndDelete(catid);
        if(!deletedCategory)
        {
            return res.status(404).json({ success: false, msg: "Category not found" });
        }
        return res.status(200).json({ success: true, msg: "Category deleted successfully" });
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({success: false, msg: "Internal server error"}); 
    }
}