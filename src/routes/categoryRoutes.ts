import express from 'express';
import { CategoryController } from "../controllers/categoryController";
import { authenticateToken } from '../lib/tokenManager';

const router = express.Router();

router.post("/categories", authenticateToken, CategoryController.createCategory);
router.get("/categories", authenticateToken, CategoryController.getCategories);
router.get("/categories/:idCategory", authenticateToken, CategoryController.getCategoryById);
router.patch("/categories/:idCategory", authenticateToken, CategoryController.editCategoryById);
router.delete("/categories/:idCategory", authenticateToken, CategoryController.deleteCategoryById);
router.delete("/categories", authenticateToken, CategoryController.deleteCategories);

export default router;