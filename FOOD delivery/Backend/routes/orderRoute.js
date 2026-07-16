import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, removeOrder } from "../controllers/orderController.js";
import express from "express";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", authMiddleware, verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);
orderRouter.post("/remove", removeOrder);

export default orderRouter;