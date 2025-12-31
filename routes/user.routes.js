import express from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { loginUserController, logoutUserController, registerUserController, updatePasswordController } from "../controllers/user.controllers.js";
import { verifyJwtMiddleware } from "../middlewares/auth.middlewares.js";

let router = express.Router();

router.post("/register",upload.single("profileImage"),registerUserController);
router.post("/login",loginUserController);
router.post("/logout",verifyJwtMiddleware,logoutUserController);
router.put("/updatepassword/:userid",verifyJwtMiddleware,updatePasswordController);

export default router;