// controllers/applicationController.js
import Application from "../models/Application.js";
import StudentProfile from "../models/StudentProfile.js";
import CompanyJobProfile from "../models/CompanyJobProfile.js";
import { apiResponse } from "../util/apiResponse.js";
import Company from "../models/Company.js";


export const addApplication = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware
    const jobId = req.params.job_id;

    // Step 1: find student profile
    const studentProfile = await StudentProfile.findOne({ userId });
    if (!studentProfile) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Student profile not found",
          status: 404,
        })
      );
    }

    // Step 2: check if already applied
    const existingApp = await Application.findOne({
      student_id: studentProfile._id,
      job_profile_id: jobId,
    });
    if (existingApp) {
      return res.status(400).json(
        apiResponse({
          success: false,
          message: "You have already applied for this job",
          status: 400,
        })
      );
    }

    // Step 3: find company_role_id from mapping if exists
    const roleMap = await CompanyJobProfile.findOne({ _id: jobId });
    if (!roleMap) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Company role mapping not found",
          status: 404,
        })
      );
    }

    // Step 4: create application
    const newApplication = await Application.create({
      student_id: studentProfile._id,
      company_role_id: roleMap._id,
      job_profile_id: jobId,
    });

    return res.json(
      apiResponse({
        success: true,
        message: "Application submitted successfully",
        data: newApplication,
        status: 200,
      })
    );
  } catch (err) {
    console.error("Error adding application:", err);
    return res.status(500).json(
      apiResponse({
        success: false,
        message: "Server error while submitting application",
        error: err.message,
        status: 500,
      })
    );
  }
};

export const checkIfApplied = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware
    const jobId = req.params.job_id;

    // Step 1: find student profile
    const studentProfile = await StudentProfile.findOne({ userId });
    if (!studentProfile) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Student profile not found",
          status: 404,
        })
      );
    }

    // Step 2: check for existing application
    const existingApp = await Application.findOne({
      student_id: studentProfile._id,
      job_profile_id: jobId,
    });

    const alreadyApplied = !!existingApp;

    // Step 3: send response
    return res.json(
      apiResponse({
        success: true,
        data: { applied: alreadyApplied },
        message: alreadyApplied
          ? "Application already exists"
          : "No existing application found",
        status: 200,
      })
    );
  } catch (err) {
    console.error("Error checking application:", err);
    return res.status(500).json(
      apiResponse({
        success: false,
        message: "Server error while checking application",
        error: err.message,
        status: 500,
      })
    );
  }
};

export const listAllApplications = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware

    // Step 1: Find student profile
    const studentProfile = await StudentProfile.findOne({ userId });
    if (!studentProfile) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Student profile not found",
          status: 404,
        })
      );
    }

    // Step 2: Find all applications for this student
    const applications = await Application.find({ student_id: studentProfile._id });

    // Step 3: Fetch job profiles and company info manually
    const responseData = [];
    for (const app of applications) {
      const job = await CompanyJobProfile.findById(app.job_profile_id).lean();
      if (!job) continue;

      const company = await Company.findById(job.company_id).lean();
      responseData.push({
        jobId: job._id,
        status: app.status || "Pending",
        title: job.title,
        companyName: company?.name || "Unknown",
        companyLogo: company?.logo || "",
      });
    }

    return res.status(200).json(
      apiResponse({
        success: true,
        message: "Applications fetched successfully",
        data: responseData,
        status: 200,
      })
    );
  } catch (err) {
    return res.status(500).json(
      apiResponse({
        success: false,
        message: "Server error while fetching applications",
        error: err.message,
        status: 500,
      })
    );
  }
};

export const getPendingApplicationsByJobId = async (req, res) => {
  try {
    const { job_id } = req.params;

    if (!job_id) {
      return res.status(400).json(
        apiResponse({
          success: false,
          message: "Job ID is required",
          status: 400,
        })
      );
    }

    const applications = await Application.find({ job_profile_id: job_id, status: "pending" }).lean();

    const responseData = [];
    for (const app of applications) {
      const student = await StudentProfile.findById(app.student_id).lean();
      responseData.push({
        applicationId: app._id,
        studentId: student?._id,
        studentName: student?.name || "Unknown",
        studentEmail: student?.email || "Unknown",
        status: app.status || "Pending",
      });
    }

    return res.status(200).json(
      apiResponse({
        success: true,
        message: "Pending applications fetched successfully",
        data: responseData,
        status: 200,
      })
    );
  } catch (err) {
    return res.status(500).json(
      apiResponse({
        success: false,
        message: "Server error while fetching applications",
        error: err.message,
        status: 500,
      })
    );
  }
};