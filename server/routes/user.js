import express from "express";
import { deleteUser } from "../controller/userController.js";
import { authenticate, authorize } from "../middleware/auth.js";
const router = express.Router();

router.delete("/user/delete/:userId", authenticate, authorize(["TPC"]),deleteUser);

export default router;