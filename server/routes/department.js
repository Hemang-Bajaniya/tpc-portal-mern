import express from 'express';
import Department from '../models/Department.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { apiResponse } from '../util/apiResponse.js';

const router = express.Router();

// Get all departments
router.get('/', async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json(new apiResponse({ success: true, message: 'Departments retrieved successfully', data: departments }));
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

export default router;