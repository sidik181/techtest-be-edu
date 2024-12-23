import express from "express";
import { ProductController } from "../controllers/productController";
import { authenticateToken } from "../lib/tokenManager";

const router = express.Router();

router.post("/products", authenticateToken, ProductController.createProduct);
router.get("/products", authenticateToken, ProductController.getProducts);
router.get("/products/:idProduct", authenticateToken, ProductController.getProductById);
router.patch("/products/:idProduct", authenticateToken, ProductController.editProductById);
router.delete("/products/:idProduct", authenticateToken, ProductController.deleteProductById);
router.delete("/products", authenticateToken, ProductController.deleteProducts);

export default router;
