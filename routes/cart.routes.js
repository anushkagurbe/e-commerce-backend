import express from "express"; 
import { verifyJwtMiddleware } from "../middlewares/auth.middlewares.js";
import { addToCartController, getUserCartItemsController, removeItemFromCartController, updateCartController } from "../controllers/cart.controllers.js";

let router = express.Router();

router.post("/addtocart", verifyJwtMiddleware, addToCartController);
router.put("/updatecart", verifyJwtMiddleware, updateCartController);
router.delete("/removecartitem", verifyJwtMiddleware, removeItemFromCartController);
router.get("/getusercartitems", verifyJwtMiddleware, getUserCartItemsController);

export default router;