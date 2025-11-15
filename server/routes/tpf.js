import express from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get("/profile", authenticate, authorize(["TPF"]));
router.put("/profile", authenticate, authorize(["TPF"]));