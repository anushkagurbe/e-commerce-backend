import express from "express";
import { isAdminMiddleware, verifyJwtMiddleware } from "../middlewares/auth.middlewares.js";
import { createProductController, getProductsCategorywiseController, getAllProductsController } from "../controllers/product.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

let router = express.Router();

router.post("/addproduct",verifyJwtMiddleware,isAdminMiddleware,upload.array("images",5),createProductController);
router.get("/getproductscategorywise/:catid",getProductsCategorywiseController);
router.get("/getallproducts/",getAllProductsController)

export default router;