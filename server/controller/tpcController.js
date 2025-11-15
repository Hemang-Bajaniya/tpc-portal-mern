import StudentProfile from "../models/StudentProfile.js";
import TpcProfile from "../models/TpcProfile.js";
import User from "../models/User.js";
import Company from "../models/Company.js";
import PlacedStudent from "../models/PlacedStudent.js";
import { apiResponse } from "../util/apiResponse.js";
import AcademicDetails from "../models/AcademicDetails.js";

// List all students pending approval for the TPC's department
export const listPendingStudents = async (req, res) => {
  try {
    const tpcUserId = req.user.userId;
    const tpcProfile = await TpcProfile.findOne({ userId: tpcUserId });

    if (!tpcProfile) {
      return res
        .status(404)
        .json(
          apiResponse({
            success: false,
            message: "TPC profile not found",
            status: 404,
          })
        );
    }

    const deptId = tpcProfile.dept_id;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    // Aggregation pipeline to match, join, and format the data
    const aggregationPipeline = [
      // Stage 1: Match unapproved students from the TPC's department
      {
        $match: {
          approved: false,
          dept_id: deptId,
          role: "Student",
        },
      },
      // Stage 2: Perform a "left join" to the studentprofiles collection
      {
        $lookup: {
          from: "studentprofiles", // Mongoose automatically pluralizes the model name for the collection
          localField: "_id", // Field from the User collection
          foreignField: "userId", // Field from the StudentProfile collection
          as: "profile", // Name for the new array field
        },
      },
      // Stage 3: Deconstruct the 'profile' array to a single object
      {
        $unwind: {
          path: "$profile",
          preserveNullAndEmptyArrays: true, // Keep users even if they haven't created a profile yet
        },
      },
      // Stage 4: Project the final desired fields
      {
        $project: {
          _id: 1, // Exclude the default _id field
          college_id: { $ifNull: ["$profile.college_id", "-"] },
          name: {
            $concat: [
              { $ifNull: ["$profile.f_name", "Student"] },
              " ",
              { $ifNull: ["$profile.l_name", ""] },
            ],
          },
          email: "$email",
          createdAt: "$createdAt",
        },
      },
      // Stage 5: Handle pagination and total count efficiently
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
        },
      },
    ];

    const result = await User.aggregate(aggregationPipeline);

    const pendingStudents = result[0].data;
    const total =
      result[0].metadata.length > 0 ? result[0].metadata[0].total : 0;

    return res.json(
      apiResponse({
        data: pendingStudents,
        total,
        message: "Pending students fetched successfully",
        status: 200,
      })
    );
  } catch (err) {
    console.error("Error fetching pending students:", err);
    res
      .status(500)
      .json(
        apiResponse({
          success: false,
          message: "Server error",
          error: err.message,
          status: 500,
        })
      );
  }
};

// Approve or decline a student registration (only for TPC's department)
export const approveOrDeclineStudent = async (req, res) => {
  try {
    const tpcUserId = req.user.userId;
    const tpcProfile = await TpcProfile.findOne({ userId: tpcUserId }).populate(
      "dept_id"
    );
    if (!tpcProfile)
      return res.status(404).json({ message: "TPC profile not found" });
    const deptId = tpcProfile.dept_id._id;
    const { studentEmail, approve } = req.body;
    const student = await User.findOne({ email: studentEmail });
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (String(student.dept_id) !== String(deptId)) {
      return res
        .status(403)
        .json({ message: "Not authorized to approve/decline this student" });
    }
    student.approved = approve;
    await student.save();
    res.json({ message: approve ? "Student approved" : "Student rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getTpcProfile = async (req, res) => {
  try {
    const tpcUserId = req.user.userId;

    const tpcProfile = await TpcProfile.findOne({ userId: tpcUserId }).populate("userId", "email");
    if (!tpcProfile) {
      return res
        .status(404)
        .json(
          apiResponse({
            success: false,
            message: "TPC profile not found",
            status: 404,
          })
        );
    }
    return res.json(
      apiResponse({
        data: tpcProfile,
        message: "TPC profile fetched",
        status: 200,
      })
    );
  } catch (err) {
    res
      .status(500)
      .json(
        apiResponse({
          success: false,
          message: "Server error",
          error: err.message,
          status: 500,
        })
      );
  }
};

export const updateTpcprofile = async (req, res) => {
  try {
    const tpcUserId = req.user.userId;
    const { name, gender, mobile, email, dept_id } = req.body;
    console.log(dept_id);

    const tpcProfile = await TpcProfile.findOne({ userId: tpcUserId });
    if (!tpcProfile) {
      return res
        .status(404)
        .json(
          apiResponse({
            success: false,
            message: "TPC profile not found",
            status: 404,
          })
        );
    }

    const user = await User.findById(tpcProfile.userId);
    if (!user) {
      return res
        .status(404)
        .json(
          apiResponse({
            success: false,
            message: "Associated user not found",
            status: 404,
          })
        );
    }

    if (name !== undefined) tpcProfile.name = name;
    if (gender !== undefined) tpcProfile.gender = gender;
    if (mobile !== undefined) tpcProfile.mobile = mobile;
    if (email !== undefined) user.email = email;
    if (dept_id !== undefined) { user.dept_id = dept_id; tpcProfile.dept_id = dept_id; };

    await tpcProfile.save();
    await user.save();
    return res.json(
      apiResponse({
        data: tpcProfile,
        message: "TPC profile updated",
        status: 200,
      })
    );
  } catch (err) {
    res
      .status(500)
      .json(
        apiResponse({
          success: false,
          message: "Server error",
          error: err.message,
          status: 500,
        })
      );
  }
};

export const postPlacedStudents = async (req, res) => {
  try {
    const { studentId, companyId, jobProfileId } = req.body;

    // Basic validation
    if (!studentId || !companyId || !jobProfileId) {
      return res
        .status(400)
        .json(
          apiResponse({
            success: false,
            message: "studentId, companyId, and jobProfileId are required",
            status: 400,
          })
        );
    }

    // Check if the student exists
    const student = await StudentProfile.findById(studentId);
    if (!student) {
      return res
        .status(404)
        .json(
          apiResponse({
            success: false,
            message: "Student not found",
            status: 404,
          })
        );
    }

    // Check if the company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res
        .status(404)
        .json(
          apiResponse({
            success: false,
            message: "Company not found",
            status: 404,
          })
        );
    }

    // Create and save the placed student record
    const placedStudent = new PlacedStudent({
      studentId,
      companyId,
      jobProfileId,
    });
    await placedStudent.save();

    return res
      .status(201)
      .json(
        apiResponse({
          success: true,
          message: "Placed student record created",
          data: placedStudent,
          status: 201,
        })
      );
  } catch (error) {
    console.error("Error posting placed student:", error);
    return res
      .status(500)
      .json(
        apiResponse({
          success: false,
          message: "Server error",
          error: error.message,
          status: 500,
        })
      );
  }
};

// Get all students with their academic details
export const getAllStudents = async (req, res) => {
  try {
    const students = await StudentProfile.find()
      .populate("dept_id", "name") // Assuming Department model has a 'name' field
      .populate("academicDetails")
      .lean(); // Convert to plain JavaScript object for easier manipulation

    // Transform data to match frontend expectations
    const formattedStudents = students.map((student) => ({
      userId: student._id.toString(),
      name: `${student.f_name} ${student.m_name || ""} ${student.l_name || ""
        }`.trim(),
      college_id: student.college_id,
      email: student.email || "N/A", // Add email if available in User model (populate if needed)
      dept_name: student.dept_id?.name || "Unknown",
      isPlaced: student.isPlaced,
      academicDetails: student.academicDetails || {
        qualificationType: "N/A",
        hsc_percentage: null,
        diploma_cgpa: null,
        ssc_percentage: 0,
        be_percentage: 0,
        be_cgpa: 0,
        liveKT: 0,
        deadKT: 0,
        semesters: Array.from({ length: 8 }, (_, i) => ({
          sem: i + 1,
          sgpa: 0,
          percentage: 0,
          resultFile: "",
        })),
      },
    }));

    res.status(200).json(
      new apiResponse({
        data: formattedStudents,
        message: "Students fetched successfully",
        status: 200,
        success: true,
      })
    );
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json(
      new apiResponse({
        success: false,
        message: "Server error",
        error: error.message,
        status: 500,
      })
    );
  }
};

export const getPendingAcademicApprovals = async (req, res) => {
  try {
    const pendingAcademics = await AcademicDetails.find({ approved: "pending" })
      .populate({
        path: "user_id",
        model: StudentProfile,
        select: "college_id f_name userId",  // fetch only what we need
        populate: {
          path: "userId",
          model: User,
          select: "email"
        }
      })
      .lean();

    const results = pendingAcademics.map((item) => ({
      _id: item._id,
      student_id: item.user_id._id || "",
      userId: item.user_id?.userId._id || "",
      college_id: item.user_id?.college_id || "",
      name: item.user_id?.f_name || "",
      email: item.user_id?.userId?.email || "",
      approved: item.approved,
      createdAt: item.createdAt
    }));

    return res.status(200).json(
      apiResponse({
        success: true,
        message: "Pending academic approvals fetched successfully",
        data: results,
        status: 200,
      })
    );
  } catch (err) {
    console.error("Error fetching pending academic approvals:", err);
    return res.status(500).json(
      apiResponse({
        success: false,
        message: "Internal server error",
        error: err.message,
        status: 500,
      })
    );
  }
};

export const getAllStudentsWithPlacementStatus = async (req, res) => {
  try {
    // 📌 Fetch all students with their User data
    const students = await StudentProfile.find()
      .populate({
        path: "userId",
        model: User,
        select: "_id email"
      })
      .lean();

    const formattedStudents = students.map((student) => {
      const fName = student.f_name || "";
      const mName = student.m_name || "";
      const lName = student.l_name || "";

      const fullName = [lName, fName, mName].filter(Boolean).join(" ");

      return {
        _id: student._id,
        userId: student.userId?._id || null,
        student_name: fullName.trim(),
        college_id: student.college_id || "-",
        email: student.userId?.email || "N/A",
        isPlaced: student.isPlaced ? "Placed" : "Not Placed",
      };
    });

    return res.status(200).json(
      apiResponse({
        success: true,
        message: "Student list fetched successfully",
        data: formattedStudents,
        status: 200,
      })
    );
  } catch (error) {
    console.error("Error fetching student list:", error);
    return res.status(500).json(
      apiResponse({
        success: false,
        message: "Internal Server Error",
        error: error.message,
        status: 500,
      })
    );
  }
};

export const deleteStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(
        apiResponse({
          success: false,
          message: "Student ID is required.",
          status: 400,
        })
      );
    }

    const student = await StudentProfile.findById(id);

    if (!student) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Student profile not found.",
          status: 404,
        })
      );
    }

    // 🔸 Delete related AcademicDetails (if exists)
    await AcademicDetails.deleteOne({ user_id: student._id }).catch((err) => {
      console.warn("AcademicDetails not found or already deleted:", err.message);
    });

    // 🔸 Delete related PlacedStudent (if exists)
    await PlacedStudent.deleteMany({ studentId: student._id }).catch((err) => {
      console.warn("PlacedStudent record not found or already deleted:", err.message);
    });

    // 🗑️ Delete the StudentProfile itself
    await StudentProfile.deleteOne({ _id: id });

    return res.status(200).json(
      apiResponse({
        success: true,
        message: "Student profile and related records deleted successfully.",
        status: 200,
      })
    );
  } catch (error) {
    console.error("Error deleting student profile:", error);
    return res.status(500).json(
      apiResponse({
        success: false,
        message: "Internal server error.",
        error: error.message,
        status: 500,
      })
    );
  }
};

export const updateAcademicApprovalStatus = async (req, res) => {
  try {
    const { studentId, approved } = req.body;

    if (!["pending", "approved", "rejected"].includes(approved)) {
      return res.status(400).json(
        apiResponse({
          success: false,
          message: "Invalid approval status. Must be 'pending', 'approved', or 'rejected'.",
          status: 400,
        })
      );
    }

    const updatedRecord = await AcademicDetails.findOneAndUpdate(
      { user_id: studentId },
      { $set: { approved } },
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Academic details not found for this student.",
          status: 404,
        })
      );
    }

    return res.status(200).json(
      apiResponse({
        success: true,
        message: `Academic approval status updated to '${approved}'.`,
        data: updatedRecord,
        status: 200,
      })
    );
  } catch (error) {
    console.error("Error updating academic approval status:", error);
    return res.status(500).json(
      apiResponse({
        success: false,
        message: "Internal Server Error",
        error: error.message,
        status: 500,
      })
    );
  }
};


