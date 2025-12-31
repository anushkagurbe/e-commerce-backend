import { uploadOnCloudinary } from "../config/cloudinary.js";
import { generateAccessToken, generateRefreshToken } from "../config/tokens.js";
import userModel, { defaultAvatars } from "../models/user.model.js";
import bcrypt from "bcrypt";

export let registerUserController = async(req,res) =>{
    try
    {
        let { username, fullName, email, password, gender } = req.body;
        if(!username || !fullName || !email || !password || !gender)
        {
            return res.status(400).json({success: false, msg: "All fields are required"});
        }
        let isUserExist = await userModel.findOne({$or: [{email}, {username}]}).lean();
        if(isUserExist)
        {
            return res.status(409).json({success: false, msg: "User with email or username is already exist"});
        }
        let profileImageLocalPath = req.file?.path;
        let profileImagePath;
        if(!profileImageLocalPath)
        {
            profileImagePath = defaultAvatars[gender?.toLowerCase()] || defaultAvatars.male;
        }
        else
        {
            let profileImage = await uploadOnCloudinary(profileImageLocalPath);
            if(!profileImage?.url)
            {
                return res.status(500).json({success: false, msg: "Image upload failed"});
            }
            profileImagePath = profileImage.url;
        }
        let hashedPassword = await bcrypt.hash(password,10);
        let user = await userModel.create({username, email, password: hashedPassword, fullName, gender, profileImage: profileImagePath});
        return res.status(201).json({success: true, msg: "User registered successfully", user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            gender: user.gender,
            profileImage: user.profileImage,
            role: user.role
        }})
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success: false, msg: "Internal server error"});
    }
}

export let loginUserController = async(req,res)=>{
    try
    {
        let { email, password } = req.body;
        if(!email || !password)
        {
            return res.status(400).json({success: false, msg: "All fields are required"});
        }
        let isUserExist = await userModel.findOne({email: email});
        if(!isUserExist)
        {
            return res.status(404).json({success: false, msg: "User not found"});
        }
        let isPasswordCorrect = await bcrypt.compare(password, isUserExist.password);
        if(!isPasswordCorrect)
        {
            return res.status(401).json({success: false, msg: "Incorrect password"});
        }
        let accessToken = generateAccessToken(isUserExist);
        let refreshToken = generateRefreshToken(isUserExist);
        let options = {
            httpOnly: true,
            secure: true
        };
        await userModel.updateOne({_id: isUserExist._id}, {$set: {refreshToken: refreshToken}});
        return res.status(200)
        .cookie("refreshToken",refreshToken,options)
        .json({
            success: true, 
            user: {
                _id: isUserExist._id,
                username: isUserExist.username,
                email: isUserExist.email,
                fullName: isUserExist.fullName,
                profileImage: isUserExist.profileImage
            },
            accessToken: accessToken,
            msg: "Login successfully"
        })

    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success: false, msg: "Internal server error"});
    }
}

export let logoutUserController = async(req,res)=>{
    try
    {
        await userModel.updateOne({_id: req.user._id},{$unset: {refreshToken: 1}},{new: true});
        let options = {
            httpOnly: true,
            secure: true
        };
        return res.status(200)
        .clearCookie("refreshToken",options)
        .json({success: true, msg: "Logged out successfully"});
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success: false, msg: "Internal server error"});
    }
}

export let updatePasswordController = async(req,res)=>{
    try
    {
        let { oldPassword, newPassword } = req.body;
        let userid = req.params.userid;
        if(!oldPassword || !newPassword)
        {
            return res.status(400).json({success: false, msg: "All fields are required"})
        } 
        if(req.user._id.toString() !== userid)
        {
            return res.status(401).json({success: false, msg: "Unauthorized user"})
        }
        let user = await userModel.findOne({_id: userid},{password: 1});
        let isValidOldPassword = await bcrypt.compare(oldPassword, user.password);
        if(!isValidOldPassword)
        {
            return res.status(400).json({success: false, msg: "Incorrect old password"})
        }
        if(oldPassword == newPassword)
        {
            return res.status(400).json({success: false, msg: "Old and new password cannot be same"})
        }
        let hashedPassword = await bcrypt.hash(newPassword, 10);
        await userModel.updateOne({_id: userid}, {$set: {password: hashedPassword}});
        return res.status(200).json({success: true, msg: "Password updated successfully"});
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success: false, msg: "Internal server error"})
    }
}