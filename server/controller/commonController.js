import CompanyJobProfile from "../models/CompanyJobProfile.js";
import PlacedStudent from "../models/PlacedStudent.js";
import PlacementDrive from "../models/Drive.js";
import Company from "../models/Company.js";
import { apiResponse } from "../util/apiResponse.js";
import StudentProfile from "../models/StudentProfile.js";

// reuse helper functions (or duplicate small helpers here)
const slugify = (s = "") =>
  s
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
const formatCtc = (ctc) => {
  if (!ctc && ctc !== 0) return "Not disclosed";
  if (typeof ctc === "string") return ctc;
  if (typeof ctc === "number") {
    if (ctc <= 1000) return `${ctc} LPA`;
    return `${(ctc / 100000).toFixed(2)} LPA`;
  }
  return String(ctc);
};

const buildStudentCard = (job, company) => {
  const companyName = company?.name || company?.companyName || "Unknown";
  const logo =
    company?.logo ||
    company?.company_logo ||
    company?.logoUrl ||
    "https://via.placeholder.com/80";
  const location = job?.location || company?.address || "Not specified";
  const to = `/jobs/${job?._id}`;
  const lastDate =
    job?.last_date_for_application || job?.deadline || job?.lastDate || null;
  const last_date_for_application = lastDate
    ? new Date(lastDate).toISOString().split("T")[0]
    : null;

  return {
    company_logo: logo,
    name: companyName,
    ctc: formatCtc(job?.ctc),
    location,
    to,
    last_date_for_application,
  };
};

export const getOfferInfo = async (req, res) => {
  try {
    const { jobId, all } = req.query;
    const { dept_id } = await StudentProfile.findOne(
      { userId: req.user.userId },
      { dept_id: 1 }
    );

    console.log("dept_id", dept_id);

    // If the client requests ALL jobs (student dashboard list)
    if (all === "true") {
      const deptFilter = dept_id ? { for_dept: dept_id } : {};
      const jobs = await CompanyJobProfile.find({
        for_dept: {$in:dept_id}
      }).populate("company_id");

      

      // Return simple job cards for listing
      const cards = jobs.map((j) => ({
        id: j._id,
        title: j.title,
        company_name: j.company_id?.name || "Unknown",
        logo: j.company_id?.logo || "",
        to: `/jobs/${j._id}`,
        location: j.location,
        type: j.type,
        skills_required: j.skills_required,
        for_dept: j.for_dept,
        ctc: j.ctc,
        last_date_for_application: j.last_date_for_application,
      }));

      return res.status(200).send(
        apiResponse({
          data: cards,
          message: "All job profiles fetched successfully",
          status: 200,
          success: true,
        })
      );
    }

    if (!jobId) {
      return res.status(400).send(
        apiResponse({
          data: null,
          message: "jobId query parameter is required (or use ?all=true)",
          status: 400,
          success: false,
        })
      );
    }

    const jobProfile = await CompanyJobProfile.findById(jobId).populate(
      "company_id"
    );

    if (!jobProfile) {
      return res.status(404).send(
        apiResponse({
          data: null,
          message: "Job profile not found",
          status: 404,
          success: false,
        })
      );
    }

    // --- Split into 3 structured objects ---
    const company_detail = jobProfile.company_id
      ? {
          name: jobProfile.company_id.name,
          logo: jobProfile.company_id.logo,
          company_description: jobProfile.company_id.company_description,
          company_website: jobProfile.company_id.company_website,
          company_location: jobProfile.company_id.company_location,
          company_type: jobProfile.company_id.company_type,
        }
      : {};

    const job_detail = {
      title: jobProfile.title,
      description: jobProfile.description,
      responsibilities: jobProfile.responsibilities,
      requirements: jobProfile.requirements,
      criteria: jobProfile.criteria,
      location: jobProfile.location,
      type: jobProfile.type,
      ctc: jobProfile.ctc,
      vacancies: jobProfile.vacancies,
      bond_details: jobProfile.bond_details,
      skills_required: jobProfile.skills_required,
      last_date_for_application: jobProfile.last_date_for_application,
      for_dept: jobProfile.for_dept,
    };

    // 🔹 Hiring Process (optional if not yet implemented)
    let hiring_process = [];
    try {
      hiring_process = await HiringProcess.find({
        job_id: jobProfile._id,
      }).sort("round_number");
    } catch {
      hiring_process = [];
    }

    // --- Send coordinated structured response ---
    return res.status(200).send(
      apiResponse({
        data: {
          company: company_detail,
          job: job_detail,
          hiring_process,
        },
        message: "Job profile fetched successfully",
        status: 200,
        success: true,
      })
    );
  } catch (error) {
    console.error("Error fetching job profile:", error);
    return res.status(500).send(
      apiResponse({
        data: null,
        message: "Internal server error",
        status: 500,
        success: false,
        error: error.message,
      })
    );
  }
};

export const getPlacedStudents = async (req, res) => {
  try {
    // Fetch placed students with populated references
    const placedStudents = await PlacedStudent.find()
      .populate({
        path: "studentId",
        select: "f_name l_name email dept_id",
        populate: {
          path: "dept_id",
          select: "dept_name",
        },
      }) // Populate student details (name and email)
      .populate("companyId", "name") // Populate company details (name)
      .populate("jobProfileId", "title ctc")
      .populate("studentId.dept_id", "dept_name"); // Populate job profile details (title and ctc)
    return res.status(200).json(
      apiResponse({
        data: placedStudents,
        message: "Placed students fetched successfully",
        status: 200,
        success: true,
      })
    );
  } catch (error) {
    console.error("Error fetching placed students:", error);
    return res.status(500).json(
      apiResponse({
        success: false,
        message: "Server error",
        error: error.message,
        status: 500,
      })
    );
  }
};

export const getCompletedDrives = async (req, res) => {
  try {
    const drives = await PlacementDrive.find({ status: "Completed" })
      .populate("company", "name logo")
      .populate("job_profile", "title ctc location last_date_for_application");
    return res.status(200).json(
      apiResponse({
        data: drives,
        message: "Completed drives fetched successfully",
        status: 200,
        success: true,
      })
    );
  } catch (error) {
    console.error("Error fetching completed drives:", error);
    return res.status(500).json(
      apiResponse({
        success: false,
        message: "Server error",
        error: error.message,
        status: 500,
      })
    );
  }
};

export const getStudentSkills = async (req, res) => {
  try {
    {
    }
    const studentSkills = await StudentProfile.findOne(
      { userId: req.user.userId },
      { skills: 1 }
    );
    console.log("->", req.user);

    if (!studentSkills) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Student profile not found",
          status: 404,
        })
      );
    }
    return res.status(200).json(
      apiResponse({
        data: studentSkills,
        message: "Student skills fetched successfully",
        status: 200,
        success: true,
      })
    );
  } catch (error) {
    console.error("Error fetching student skills:", error);
    return res.status(500).json(
      apiResponse({
        success: false,
        message: "Server error",
        error: error.message,
        status: 500,
      })
    );
  }
};
