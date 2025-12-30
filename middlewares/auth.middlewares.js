import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export let verifyJwtMiddleware = async(req,res,next) =>{
    try
    {
        let token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token)
        {
            return res.status(401).json({success: false, msg: "Token not found"});
        }
        let decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if(!decodedToken)
        {
            return res.status(403).json({success: false, msg: "Invalid token"});
        }
        let user = await userModel.findOne({_id: decodedToken._id}).select("-password -refreshToken").lean();
        if(!user)
        {
            return res.status(403).json({success: false, msg: "User  not found"});
        }
        req.user = user;
        next();

    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success: false, msg: "Internal server error"})
    }
}


export let isAdminMiddleware = async(req,res,next) =>{
    try
    {
        let role = req.user.role;
        if(role!=="admin")
        {
            return res.status(403).json({success: false, msg: "Access forbidden"})
        }
        next();
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success: false, msg: "Internal server error"});
    }
}