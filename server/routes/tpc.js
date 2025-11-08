import express from 'express';

import { listPendingStudents, approveOrDeclineStudent, getTpcProfile, updateTpcprofile, postPlacedStudents, getAllStudents, getPendingAcademicApprovals, getAllStudentsWithPlacementStatus, deleteStudentProfile, updateAcademicApprovalStatus } from '../controller/tpcController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { getApplicationsByJobId, updateApplicationStatus, } from '../controller/applicationContoller.js';
import { addPlacementDrive, addRoundEmbedded, deleteRoundEmbedded, getDriveById, getPlacementDriveByJob, getRoundsByDrive, updatePlacementDrive, updateRoundEmbedded } from '../controller/placementDriveController.js';

const router = express.Router();

// TPC: List all students pending approval in their department (auth middleware required)
router.get('/student/pending', authenticate, authorize(["TPC", "TPO"]), listPendingStudents);

// TPC: Approve or reject a student (auth middleware required)
router.post('/student/approve', authenticate, authorize(["TPC", "TPO"]), approveOrDeclineStudent);

router.get('/profile', authenticate, getTpcProfile);
router.put('/profile', authenticate, authorize(["TPC"]), updateTpcprofile);

router.post('/placedStudents', authenticate, authorize(["TPO", "TPC"]), postPlacedStudents);

router.get('/allStudentsDetails', authenticate, authorize(["TPO", "TPC"]), getAllStudents);

router.get('/acadmicdetails/pending', authenticate, authorize(["TPO", "TPC"]), getPendingAcademicApprovals);

router.get('/allStudents', authenticate, authorize(["TPO", "TPC"]), getAllStudentsWithPlacementStatus);

router.delete('/students/:id', authenticate, authorize(["TPC"]), deleteStudentProfile);

router.put('/acadmicdetails/update-approved', authenticate, authorize(["Student","TPO", "TPC"]), updateAcademicApprovalStatus);

router.get('/pending-applications/:job_id',authenticate,authorize(["TPO", "TPC"]),getApplicationsByJobId);

router.patch("/update-application-status",authenticate,authorize(["TPO", "TPC"]),updateApplicationStatus);

router.post("/add-drive", authenticate, authorize(["TPC", "TPO"]), addPlacementDrive);

router.get("/get-drive/:jobId", authenticate, authorize(["TPC", "TPO"]), getPlacementDriveByJob);

router.get("/get-drive-driveId/:driveId", authenticate, authorize(["TPC", "TPO"]), getDriveById);

router.put("/update-drive/:driveId", authenticate, authorize(["TPC", "TPO"]), updatePlacementDrive);

router.get('/placement-drives/rounds/:driveId', authenticate, authorize(["TPC", "TPO"]), getRoundsByDrive);

router.post("/placement-drives/:driveId/round", authenticate, authorize(["TPC", "TPO"]), addRoundEmbedded);

router.put("/placement-drives/:driveId/round/:roundId", authenticate, authorize(["TPC", "TPO"]), updateRoundEmbedded);

router.delete("/placement-drives/:driveId/round/:roundId", authenticate, authorize(["TPC", "TPO"]), deleteRoundEmbedded);

export default router;