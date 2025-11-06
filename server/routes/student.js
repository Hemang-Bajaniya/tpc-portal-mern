import exp from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getStudentAcademicProfile, getStudentProfile, updateStudentProfile, getAllTpcProfiles, updateStudentAcadmicDetails, changePassword } from '../controller/studentController.js';
import {uploadResume,uploadResults} from '../util/multer.js';

const router = exp.Router();

router.get("/profile", authenticate, authorize(["Student", "TPC", "TPO"]), getStudentProfile);
router.put("/profile", authenticate, authorize([]), uploadResume.single('resume'), updateStudentProfile);
router.get("/academic/profile", authenticate, authorize(["Student", "TPC", "TPO" ]),getStudentAcademicProfile);
router.get('/profile/tpc-contact', authenticate, authorize(["Student", "TPC"]), getAllTpcProfiles);
router.put("/academic/profile/update", authenticate, authorize([]), uploadResults.single('results'), updateStudentAcadmicDetails);
router.put('/change-password', authenticate,authorize([]), changePassword);

export default router;