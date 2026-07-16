import { placeOrder , verifyOrder ,userOrders} from "../controllers/orderController";
import express from "express";
import authMiddleware from "../middleware/auth";



const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",authMiddleware,verifyOrder);
orderRouter.post("/userorders",authMiddleware,userOrders);

export default orderRouter;