import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { getCompletedDrives, getOfferInfo, getPlacedStudents, getStudentSkills, handleResetPassword } from "../controller/commonController.js";

const router = express.Router();

router.get('/offerinfo', authenticate, authorize([]), getOfferInfo);
router.get('/offerinfo/:jobId', authenticate, authorize([]), getOfferInfo);
router.get('/placedStudents', authenticate, authorize([]), getPlacedStudents);
router.get('/completedDrives', authenticate, authorize([]), getCompletedDrives);
router.get('/studentskills', authenticate, authorize([]), getStudentSkills);
router.put("/password-reset", authenticate, authorize([]), handleResetPassword);


export default router;