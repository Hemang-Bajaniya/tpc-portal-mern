import Department from "../models/Department.js";
import StudentProfile from "../models/StudentProfile.js";
import TpcProfile from "../models/TpcProfile.js";
import User from "../models/User.js";
import { apiResponse } from "../util/apiResponse.js";

// List all students pending approval for the TPC's department
export const listPendingStudents = async (req, res) => {
  try {
    const tpcUserId = req.user.userId;
    console.log(req.user);
    const tpcProfile = await TpcProfile.findOne({ userId: tpcUserId }).populate(
      "dept_id"
    );

    if (!tpcProfile)
      return res
        .status(404)
        .json(
          apiResponse({
            success: false,
            message: "TPC profile not found",
            status: 404,
          })
        );
    const deptId = tpcProfile.dept_id._id;
    console.log(deptId);

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const filter = { approved: false, dept_id: deptId, role: "Student" };
    const total = await User.countDocuments(filter);
    const pendingStudents = await User.find(filter)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate("dept_id");

    return res.json(
      apiResponse({
        data: pendingStudents,
        total,
        message: "Pending students fetched",
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
    const { studentId, approve } = req.body;
    const student = await User.findById(studentId);
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
    console.log(req.user);

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
    const { name, gender, mobile } = req.body;
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
    if (name !== undefined) tpcProfile.name = name;
    if (gender !== undefined) tpcProfile.gender = gender;
    if (mobile !== undefined) tpcProfile.mobile = mobile;
    await tpcProfile.save();
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
