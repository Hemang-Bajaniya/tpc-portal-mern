// controllers/applicationController.js
import Application from "../models/Application.js";
import StudentProfile from "../models/StudentProfile.js";
import CompanyJobProfile from "../models/CompanyJobProfile.js";
import { apiResponse } from "../util/apiResponse.js";
import Company from "../models/Company.js";
import User from "../models/User.js";


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

export const getApplicationsByJobId = async (req, res) => {
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

    const applications = await Application.find({ job_profile_id: job_id }).lean();

    const responseData = [];
    for (const app of applications) {
      const student = await StudentProfile.findById(app.student_id).lean();
      const user = await User.findById(student.userId).lean();
      responseData.push({
        applicationId: app._id,
        studentId: student?._id,
        collegeId: student?.college_id || "Unknown",
        studentName: student?.f_name + " " + student?.l_name || "Unknown",
        studentEmail: user?.email || "Unknown",
        studentResume: student?.resume || "Unknown",
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

export const updateApplicationStatus = async (req, res) => {
  try {
    const { student_id, job_profile_id, status } = req.body;

    // Validation
    if (!student_id || !job_profile_id || !status) {
      return res.status(400).json(
        apiResponse({
          success: false,
          message: "Missing required fields (student_id, job_profile_id, status)",
          status: 400,
        })
      );
    }

    // Check if the application exists
    const application = await Application.findOne({
      student_id,
      job_profile_id,
    });

    if (!application) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Application not found for the given student and job profile",
          status: 404,
        })
      );
    }

    // Update status
    application.status = status;
    await application.save();

    return res.status(200).json(
      apiResponse({
        success: true,
        message: "Application status updated successfully",
        data: application,
        status: 200,
      })
    );
  } catch (err) {
    console.error("Error updating application status:", err);
    return res.status(500).json(
      apiResponse({
        success: false,
        message: "Server error while updating application status",
        error: err.message,
        status: 500,
      })
    );
  }
};

export const getPlacedStudents = async (req, res) => {
  try {
    const applications = await Application.find({ status: "Selected" }).lean();

    if (!applications.length) {
      return res.json(apiResponse(true, [], "No placed students found"));
    }

    console.log(applications)

    const studentProfileIds = applications.map((app) => app.student_id);
    const jobProfileIds = applications.map((app) => app.job_profile_id);

    const [studentProfiles, jobProfiles] = await Promise.all([
      StudentProfile.find({ _id: { $in: studentProfileIds } }).lean(),
      CompanyJobProfile.find({ _id: { $in: jobProfileIds } }).lean(),
    ]);

    const userIds = studentProfiles.map((s) => s.userId);
    const companyIds = jobProfiles.map((jp) => jp.company_id);

    const [users, companies] = await Promise.all([
      User.find({ _id: { $in: userIds } }).lean(),
      Company.find({ _id: { $in: companyIds } }).lean(),
    ]);

    const studentProfileMap = Object.fromEntries(
      studentProfiles.map((s) => [s._id.toString(), s])
    );
    const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u]));
    const jobProfileMap = Object.fromEntries(jobProfiles.map((jp) => [jp._id.toString(), jp]));
    const companyMap = Object.fromEntries(companies.map((c) => [c._id.toString(), c]));

    const placedStudents = applications.map((app) => {
      const studentProfile = studentProfileMap[app.student_id.toString()];
      const user = studentProfile ? userMap[studentProfile.userId.toString()] : null;
      const jobProfile = jobProfileMap[app.job_profile_id.toString()];
      const company = jobProfile ? companyMap[jobProfile.company_id.toString()] : null;

      return {
        college_id: studentProfile?.college_id || "",
        name: `${studentProfile?.f_name || ""} ${studentProfile?.l_name || ""}`,
        company: company?.name || "",
        logo: company?.logo || "",
        job_title: jobProfile?.title || "",
        ctc: jobProfile?.ctc ? `${jobProfile.ctc}` : "",
        location: jobProfile?.location || "",
      };
    });

    res.send(apiResponse({
      data: placedStudents,
      success: true,
      message: "Placed students fetched successfully",
    }));
  } catch (err) {
    console.error("Error fetching placed students:", err);
    res.status(500).json(apiResponse(false, null, "Server Error"));
  }
};