import express from "express";
import { getAcademicDetails } from "../controller/acadmicDetailsController";
import { authenticate } from "../middleware/auth";
const router = express.Router();

router.get("/:userId", authenticate, authorize(["TPC", "TPO"]),getAcademicDetails);

export default router;