import e from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { createJob, getJobs, getJobById, updateJob, deleteJob, getActiveJobs } from "../controller/jobController.js";

const router = e.Router();

router.post("/", authenticate, authorize(["TPC", "TPO"]), createJob);
router.get("/", authenticate, authorize(["TPC", "TPO", "TPF", "Student"]), getJobs);
router.get("/active", authenticate, authorize(["TPC", "TPO"]), getActiveJobs);
router.get("/:id", authenticate, authorize(["TPC", "TPO", "TPF", "Student"]), getJobById);
router.put("/:id", authenticate, authorize(["TPC", "TPO"]), updateJob);
router.delete("/:id", authenticate, authorize(["TPC", "TPO"]), deleteJob);

export default router;