import express from 'express';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// TPO: List all TPCs pending approval
router.get('/tpc/pending', authenticate, authorize(["TPO"]), async (req, res) => {
    try {
        const pendingTPCs = await User.find({ role: 'TPC', approved: false });
        res.json(pendingTPCs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// TPO: Approve or reject a TPC
router.post('/tpc/approve', authenticate, authorize(["TPO"]), async (req, res) => {
    try {
        const { userId, approve } = req.body;
        const user = await User.findById(userId);
        if (!user || user.role !== 'TPC') {
            return res.status(404).json({ message: 'TPC not found' });
        }
        user.approved = approve;
        await user.save();
        res.json({ message: approve ? 'TPC approved' : 'TPC rejected' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

export default router;
