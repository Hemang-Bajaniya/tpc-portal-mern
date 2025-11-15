import exp from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getStudentAcademicProfile, getStudentProfile, updateStudentProfile, getAllTpcProfiles, updateStudentAcadmicDetails, changePassword, getCollegeId, updateStudentProfileId, updateStudentAcadmicDetailsId } from '../controller/studentController.js';
import { uploadResume, uploadResults } from '../util/multer.js';
import { addApplication, checkIfApplied, getPlacedStudents, listAllApplications } from '../controller/applicationContoller.js';
import { getDriveWithSelectedStudents, getOngoingDrives } from '../controller/placementDriveController.js';

const router = exp.Router();

// For own profile
router.get(
    "/profile",
    authenticate,
    authorize(["Student", "TPC", "TPO"]),
    getStudentProfile
);

// For profile by userId param
router.get(
    "/profile/:userId",
    authenticate,
    authorize(["Student", "TPC", "TPO"]),
    getStudentProfile
);


router.put("/profile", authenticate, authorize([]), uploadResume.single('resume'), updateStudentProfile);
router.put("/profile/:userId", authenticate, authorize([]), uploadResume.single('resume'), updateStudentProfileId);
// router.get("/academic/profile", authenticate, authorize(["Student", "TPC", "TPO"]), getStudentAcademicProfile);
router.get(
    "/academic/profile",
    authenticate,
    authorize(["Student", "TPC", "TPO"]),
    getStudentAcademicProfile
);

router.get(
    "/academic/profile/:userId",
    authenticate,
    authorize(["Student", "TPC", "TPO"]),
    getStudentAcademicProfile
);
router.put("/profile-id/:userId", authenticate, authorize([]), uploadResume.single('resume'), updateStudentProfile);
router.get('/profile/tpc/contact-tpc', authenticate, authorize([]), getAllTpcProfiles);
router.put("/academic/profile/update", authenticate, authorize([]), uploadResults.single('results'), updateStudentAcadmicDetails);
router.put("/academic/profile/update/:userId", authenticate, authorize([]), uploadResults.single('results'), updateStudentAcadmicDetailsId);
router.put('/change-password', authenticate, authorize([]), changePassword);
router.post('/add-application/:job_id', authenticate, authorize(["Student"]), addApplication);
router.post('/check-application/:job_id', authenticate, authorize(["Student"]), checkIfApplied);
router.get('/get-application', authenticate, authorize(["Student"]), listAllApplications);

router.get('/get-drive/:driveId/with-students', authenticate, authorize(["Student"]), getDriveWithSelectedStudents);
router.get('/getcollegeid', authenticate, authorize(["Student"]), getCollegeId);
router.get('/get-ongoing-drive', authenticate, authorize(["Student"]), getOngoingDrives);
router.get('/get-placed-students', authenticate, authorize(["Student", "TPC", "TPO"]), getPlacedStudents);

export default router;