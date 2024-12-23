import express from "express";
import { OrderController } from "../controllers/orderController";
import { authenticateToken } from "../lib/tokenManager";

const router = express.Router();

router.post("/orders", authenticateToken, OrderController.createOrder);
router.get("/orders", authenticateToken, OrderController.getOrders);
router.get("/orders/:idOrder", authenticateToken, OrderController.getOrderById);

export default router;
