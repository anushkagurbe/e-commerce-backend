import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbconnection } from "./config/dbconnect.js";

let app = express();

app.use(cors());
dotenv.config();
await dbconnection();
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.listen(process.env.PORT, ()=>{
    console.log("Server is running on PORT "+process.env.PORT);
})