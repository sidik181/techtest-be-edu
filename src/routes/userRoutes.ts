import express from "express";
import { UserController } from "../controllers/userController";
import { authenticateToken } from "../lib/tokenManager";

const router = express.Router();

router.post("/users", authenticateToken, UserController.createUser);
router.get("/users", authenticateToken, UserController.getUsers);
router.get("/users/:idUser", authenticateToken, UserController.getUserById);
router.patch("/users/:idUser", authenticateToken, UserController.editUserById);
router.delete("/users/:idUser", authenticateToken, UserController.deleteUserById);
router.delete("/users", authenticateToken, UserController.deleteUsers);

export default router;