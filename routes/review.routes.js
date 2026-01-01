import express from "express";  
import { verifyJwtMiddleware } from "../middlewares/auth.middlewares.js";
import { addReviewController, deleteReviewController, getProductReviewsController } from "../controllers/review.controllers.js";

let router = express.Router();

router.post("/addreview", verifyJwtMiddleware, addReviewController);
router.get("/getproductreviews/:productid", getProductReviewsController);
router.delete("/deletereview/:reviewid",verifyJwtMiddleware, deleteReviewController);

export default router;