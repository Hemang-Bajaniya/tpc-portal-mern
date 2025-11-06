import express from 'express';

import { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany } from '../controller/companyController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize(["TPC", "TPO"]), createCompany);
router.get('/', authenticate, authorize(["TPC", "TPO", "TPF", "Student"]), getCompanies);
router.get('/:id', authenticate, authorize(["TPC", "TPO", "TPF", "Student"]), getCompanyById);
router.put('/:id', authenticate, authorize(["TPC", "TPO"]), updateCompany);
router.delete('/:id', authenticate, authorize(["TPC", "TPO"]), deleteCompany);

export default router;