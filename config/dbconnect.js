import mongoose from "mongoose";

export let dbconnection = async()=>{
    try
    {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to database");
    }
    catch(error)
    {
        console.log("Database connection failed "+error);
        process.exit(1);
    }
}