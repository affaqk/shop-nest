import express from "express";
const orderRouter = express.Router();
import { createOrder, myOrders, getAllOrders, orderDetail, updateOrderStatus, cancelOrder, deleteOrder } from "../controllers/orderController.js";
import { isAdmin, isAuthenticated } from "../utils/userAuth.js";

orderRouter.post("/create-order", isAuthenticated, createOrder);
orderRouter.get("/my-orders", isAuthenticated, myOrders);
orderRouter.get("/all", isAuthenticated, isAdmin("admin"), getAllOrders);
orderRouter.get("/order-detail/:id", isAuthenticated, orderDetail);
orderRouter.put("/cancel-order/:id", isAuthenticated, cancelOrder);
orderRouter.put("/update-status/:id", isAuthenticated, isAdmin("admin"), updateOrderStatus);
orderRouter.delete("/delete-order/:id", isAuthenticated, isAdmin("admin"), deleteOrder);

export default orderRouter;
