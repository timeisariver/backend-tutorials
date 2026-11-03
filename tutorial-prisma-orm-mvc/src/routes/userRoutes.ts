import { Router } from "express";
import { UserController } from "../controllers/userController.js";

const router = Router();

// TODO ③ URL と Controller の関数をつなぐ（5 行）
router.get("/users", UserController.index);
router.get("/users/:id", UserController.show);
router.post("/users", UserController.create);
router.put("/users/:id", UserController.update);
router.delete("/users/:id", UserController.delete);

export default router;
