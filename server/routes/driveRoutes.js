import express from 'express';
import {
    createDrive,
    getDrives,
    getDriveById,
    updateDrive,
    deleteDrive,
    createDrivesFromJobs
} from '../controller/driveController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// standard CRUD
router.post('/', authenticate, authorize(["TPC", "TPO"]), createDrive);
router.get('/', authenticate, authorize([]), getDrives);
router.get('/:id', authenticate, authorize([]), getDriveById);
router.put('/:id', authenticate, authorize(["TPC", "TPO"]), updateDrive);
router.delete('/:id', authenticate, authorize(["TPC", "TPO"]), deleteDrive);

// helper endpoint: create drives grouped by company from job ids
router.post('/create-from-jobs', createDrivesFromJobs);

export default router;