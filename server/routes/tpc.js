import express from 'express';

import { listPendingStudents, approveOrDeclineStudent, getTpcProfile, updateTpcprofile, postPlacedStudents, getAllStudents, getPendingAcademicApprovals, getAllStudentsWithPlacementStatus, deleteStudentProfile, updateAcademicApprovalStatus } from '../controller/tpcController.js';
import { authenticate, authorize } from '../middleware/auth.js';

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

router.put('/acadmicdetails/update-approved', authenticate, authorize(["TPO", "TPC"]), updateAcademicApprovalStatus);

export default router;