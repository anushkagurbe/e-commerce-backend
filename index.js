import "dotenv/config";
import express from "express";
import cors from "cors";
import { dbconnection } from "./config/dbconnect.js";
import userRoutes from "./routes/user.routes.js";
import categoriesRoutes from "./routes/category.routes.js";
import productsRoutes from "./routes/product.routes.js";

let app = express();


app.use(cors());
dbconnection();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.use("/api/v1/users",userRoutes);
app.use("/api/v1/categories",categoriesRoutes);
app.use("/api/v1/products",productsRoutes);

app.listen(process.env.PORT, ()=>{
    console.log("Server is running on PORT "+process.env.PORT);
})