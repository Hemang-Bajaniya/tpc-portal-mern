import exp from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getStudentAcademicProfile, getStudentProfile, updateStudentProfile, getCompanies, getAllTpcProfiles } from '../controller/studentController.js';
import uploadResume from '../util/multer.js';

const router = exp.Router();

router.get("/profile", authenticate, authorize, getStudentProfile);
router.put("/profile", authenticate, authorize, uploadResume.single('resume'), updateStudentProfile);
router.get("/academic/profile", authenticate, getStudentAcademicProfile);
router.get("/companies", authenticate, authorize, getCompanies);
router.get('/profile/all', authenticate, authorize, getAllTpcProfiles);

export default router;