import express from "express";
import { isAdminMiddleware, verifyJwtMiddleware } from "../middlewares/auth.middlewares.js";
import { addCategoryController, deleteCategoryController, getAllCategoriesController, getSingleCategoryController, updateCategoryController } from "../controllers/category.controllers.js";

let router = express.Router();

router.post("/addcategory",verifyJwtMiddleware,isAdminMiddleware,addCategoryController);
router.get("/getallcategories",getAllCategoriesController);
router.get("/getsinglecategory/:catid",getSingleCategoryController);
router.put("/updatecategory/:catid",verifyJwtMiddleware,isAdminMiddleware,updateCategoryController);
router.delete("/deletecategory/:catid",verifyJwtMiddleware,isAdminMiddleware,deleteCategoryController);

export default router;