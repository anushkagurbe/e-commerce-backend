import jwt from "jsonwebtoken";

export let generateAccessToken =(user)=>{
    let accessToken = jwt.sign({
        _id: user._id,
        username: user.username,
        email: user.email
    },process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
    return accessToken;
}

export let generateRefreshToken =(user)=>{
    let refreshToken = jwt.sign({
        _id: user._id
    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
    return refreshToken;
}