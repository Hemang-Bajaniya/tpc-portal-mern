import express from 'express';

import { listPendingStudents, approveOrDeclineStudent, getTpcProfile, updateTpcprofile } from '../controller/tpcController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// TPC: List all students pending approval in their department (auth middleware required)
router.get('/student/pending', authenticate, listPendingStudents);

// TPC: Approve or reject a student (auth middleware required)
router.post('/student/approve', authenticate, approveOrDeclineStudent);

router.get('/profile', authenticate, getTpcProfile);
router.put('/profile', authenticate, updateTpcprofile);

export default router;
