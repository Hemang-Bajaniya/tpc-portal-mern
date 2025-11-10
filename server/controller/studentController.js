import { apiResponse } from "../util/apiResponse.js";
import StudentProfile from "../models/StudentProfile.js";
import PendingChange from "../models/PendingChange.js";
import AcademicDetails from "../models/AcademicDetails.js";
import TpcProfile from "../models/TpcProfile.js";
import Department from "../models/Department.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getStudentProfile = async (req, res) => {
  try {
    const { userId: loggedInUserId } = req.user;
    const { studentId } = req.query;
    const { userId: paramUserId } = req.params;

    console.log(paramUserId);

    let profile;

    if (paramUserId) {
      console.log("ok");

      profile = await StudentProfile.findOne({ userId: paramUserId }).populate(
        "dept_id"
      );
      console.log(profile);
    } else if (studentId) {
      profile = await StudentProfile.findOne({
        college_id: studentId,
      }).populate("dept_id");
    } else {
      profile = await StudentProfile.findOne({
        userId: loggedInUserId,
      }).populate("dept_id");
    }

    if (!profile)
      return res
        .status(404)
        .send(new apiResponse({ data: null, message: "Profile not found" }));

    const profileObj = profile.toObject();
    profileObj.resume = profile.resume || "";

    return res.send(
      new apiResponse({ data: profileObj, message: "Found", success: true })
    );
  } catch (error) {
    return res
      .status(500)
      .send(new apiResponse({ data: null, message: error.message }));
  }
};

export const getStudentAcademicProfile = async (req, res) => {
  try {
    const { userId: loggedInUserId, role } = req.user;
    const { studentId } = req.query; // for ?studentId=COL123
    const { userId: paramUserId } = req.params; // for /academic/profile/:userId

    let profile;

    // Priority:
    // 1. userId from params
    // 2. studentId from query (college_id)
    // 3. logged-in user's own userId
    if (paramUserId) {
      profile = await StudentProfile.findOne({ userId: paramUserId });
    } else if (studentId) {
      profile = await StudentProfile.findOne({ college_id: studentId });
    } else {
      profile = await StudentProfile.findOne({ userId: loggedInUserId });
    }

    if (!profile) {
      return res
        .status(404)
        .send(new apiResponse({ data: null, message: "Profile not found" }));
    }

    const academicProfile = await AcademicDetails.findOne({
      user_id: profile._id,
    });

    if (!academicProfile) {
      return res
        .status(404)
        .send(
          new apiResponse({ data: null, message: "Academic profile not found" })
        );
    }

    return res.send(
      new apiResponse({
        data: academicProfile,
        message: "Found",
        success: true,
      })
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send(new apiResponse({ data: null, message: error.message || error }));
  }
};

export const submitAcademicChanges = async (req, res) => {
  try {
    const { userId, role } = req.user; // From auth middleware
    if (role !== "student") {
      return res
        .status(403)
        .send(
          new apiResponse({
            data: null,
            message: "Unauthorized: Only students can submit changes",
          })
        );
    }

    const formData = req.body;

    // Validate form data
    const changes = {
      qualificationType: formData.qualificationType || "HSC",
      ssc_percentage: Number(formData.ssc_percentage) || 0,
      hsc_percentage:
        formData.qualificationType === "HSC"
          ? Number(formData.hsc_percentage) || 0
          : null,
      diploma_cgpa:
        formData.qualificationType === "Diploma"
          ? Number(formData.diploma_cgpa) || 0
          : null,
      be_cgpa: Number(formData.be_cgpa) || 0,
      liveKT: Number(formData.liveKT) || 0,
      deadKT: Number(formData.deadKT) || 0,
      semesters: formData.semesters
        ? JSON.parse(formData.semesters).map((sem) => ({
            sem: Number(sem.sem),
            sgpa: Number(sem.sgpa) || 0,
          }))
        : Array.from({ length: 8 }, (_, i) => ({ sem: i + 1, sgpa: 0 })),
    };

    // Basic validation (to match schema)
    if (!["HSC", "Diploma"].includes(changes.qualificationType)) {
      return res
        .status(400)
        .send(
          new apiResponse({ data: null, message: "Invalid qualificationType" })
        );
    }
    if (changes.ssc_percentage < 0 || changes.ssc_percentage > 100) {
      return res
        .status(400)
        .send(
          new apiResponse({
            data: null,
            message: "SSC Percentage must be between 0 and 100",
          })
        );
    }
    if (
      changes.qualificationType === "HSC" &&
      (changes.hsc_percentage < 0 || changes.hsc_percentage > 100)
    ) {
      return res
        .status(400)
        .send(
          new apiResponse({
            data: null,
            message: "HSC Percentage must be between 0 and 100",
          })
        );
    }
    if (
      changes.qualificationType === "Diploma" &&
      (changes.diploma_cgpa < 0 || changes.diploma_cgpa > 10)
    ) {
      return res
        .status(400)
        .send(
          new apiResponse({
            data: null,
            message: "Diploma CGPA must be between 0 and 10",
          })
        );
    }
    if (changes.be_cgpa < 0 || changes.be_cgpa > 10) {
      return res
        .status(400)
        .send(
          new apiResponse({
            data: null,
            message: "B.E. CGPA must be between 0 and 10",
          })
        );
    }
    if (changes.liveKT < 0 || changes.deadKT < 0) {
      return res
        .status(400)
        .send(
          new apiResponse({ data: null, message: "KTs cannot be negative" })
        );
    }
    if (
      changes.semesters.length !== 8 ||
      changes.semesters.some(
        (sem) => sem.sem < 1 || sem.sem > 8 || sem.sgpa < 0 || sem.sgpa > 10
      )
    ) {
      return res
        .status(400)
        .send(
          new apiResponse({ data: null, message: "Invalid semester data" })
        );
    }

    // Create pending change
    const pending = new PendingChange({
      user_id: userId,
      type: "academic",
      changes,
      status: "pending",
    });
    await pending.save();

    return res.status(200).send(
      new apiResponse({
        data: null,
        message: "Academic changes submitted for TPC approval",
        success: true,
      })
    );
  } catch (error) {
    console.error("Error submitting academic changes:", error);
    return res
      .status(500)
      .send(
        new apiResponse({
          data: null,
          message: "Failed to submit academic changes",
        })
      );
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const updateFields = { ...req.body };

    // If resume is uploaded as a file (multipart/form-data)
    if (req.file) {
      // Store relative path for frontend access
      updateFields.resume = req.file.path.replace(/\\/g, "/");
    }
    // If skills is a string, convert to array
    if (typeof updateFields.skills === "string") {
      updateFields.skills = updateFields.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    const updated = await StudentProfile.findOneAndUpdate(
      { userId },
      { $set: updateFields },
      { new: true }
    );
    if (!updated) {
      return res
        .status(404)
        .send(
          apiResponse({
            data: null,
            message: "Profile not found",
            success: false,
          })
        );
    }
    return res.send(
      apiResponse({ data: updated, message: "Profile updated", success: true })
    );
  } catch (error) {
    // console.log(error);

    return res
      .status(500)
      .send(
        apiResponse({ data: null, message: error.message, success: false })
      );
  }
};

export const updateStudentProfileId = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateFields = { ...req.body };

    // If resume is uploaded as a file (multipart/form-data)
    if (req.file) {
      // Store relative path for frontend access
      updateFields.resume = req.file.path.replace(/\\/g, "/");
    }
    // If skills is a string, convert to array
    if (typeof updateFields.skills === "string") {
      updateFields.skills = updateFields.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    const updated = await StudentProfile.findOneAndUpdate(
      { userId },
      { $set: updateFields },
      { new: true }
    );
    if (!updated) {
      return res
        .status(404)
        .send(
          apiResponse({
            data: null,
            message: "Profile not found",
            success: false,
          })
        );
    }
    return res.send(
      apiResponse({ data: updated, message: "Profile updated", success: true })
    );
  } catch (error) {
    // console.log(error);

    return res
      .status(500)
      .send(
        apiResponse({ data: null, message: error.message, success: false })
      );
  }
};

export const updateStudentAcadmicDetails = async (req, res) => {
  try {
    const { userId } = req.user; // from auth middleware
    const updateFields = { ...req.body };

    const profile = await StudentProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).send(
        apiResponse({
          data: null,
          message: "Profile not found",
          success: false,
        })
      );
    }

    if (req.file) {
      updateFields.results = req.file.path.replace(/\\/g, "/");
    }

    if (typeof updateFields.semesters === "string") {
      try {
        updateFields.semesters = JSON.parse(updateFields.semesters);
      } catch (err) {
        return res.status(400).send(
          apiResponse({
            data: null,
            message: "Invalid semesters format. Must be a valid JSON array.",
            success: false,
          })
        );
      }
    }

    [
      "hsc_percentage",
      "diploma_cgpa",
      "ssc_percentage",
      "be_percentage",
      "be_cgpa",
      "liveKT",
      "deadKT",
    ].forEach((field) => {
      if (updateFields[field] !== undefined) {
        updateFields[field] = Number(updateFields[field]);
      }
    });

    if (!updateFields.semesters) {
      updateFields.semesters = Array.from({ length: 8 }, (_, i) => ({
        sem: i + 1,
        sgpa: 0,
        percentage: 0,
      }));
    }

    updateFields.approved = "pending";

    const pendingChange = await PendingChange.create({
      user_id: profile._id,
      dept_id: profile.dept_id,
      type: "academic",
      changes: updateFields,
      status: "pending",
      submittedAt: new Date(),
    });

    const updated = await AcademicDetails.findOneAndUpdate(
      { user_id: profile._id },
      {
        $set: updateFields,
        $setOnInsert: { user_id: profile._id },
      },
      { new: true, upsert: true }
    );

    return res.send(
      apiResponse({
        data: pendingChange,
        message: "Academic update submitted and pending approval.",
        success: true,
      })
    );
  } catch (error) {
    console.error("Error updating academic details:", error);
    return res.status(500).send(
      apiResponse({
        data: null,
        message: error.message || "Internal server error",
        success: false,
      })
    );
  }
};

export const updateStudentAcadmicDetailsId = async (req, res) => {
  try {
    const { userId } = req.params; // from auth middleware
    const updateFields = { ...req.body };

    const profile = await StudentProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).send(
        apiResponse({
          data: null,
          message: "Profile not found",
          success: false,
        })
      );
    }

    if (req.file) {
      updateFields.results = req.file.path.replace(/\\/g, "/");
    }

    if (typeof updateFields.semesters === "string") {
      try {
        updateFields.semesters = JSON.parse(updateFields.semesters);
      } catch (err) {
        return res.status(400).send(
          apiResponse({
            data: null,
            message: "Invalid semesters format. Must be a valid JSON array.",
            success: false,
          })
        );
      }
    }

    [
      "hsc_percentage",
      "diploma_cgpa",
      "ssc_percentage",
      "be_percentage",
      "be_cgpa",
      "liveKT",
      "deadKT",
    ].forEach((field) => {
      if (updateFields[field] !== undefined) {
        updateFields[field] = Number(updateFields[field]);
      }
    });

    if (!updateFields.semesters) {
      updateFields.semesters = Array.from({ length: 8 }, (_, i) => ({
        sem: i + 1,
        sgpa: 0,
        percentage: 0,
      }));
    }

    updateFields.approved = "pending";

    const pendingChange = await PendingChange.create({
      user_id: profile._id,
      dept_id: profile.dept_id,
      type: "academic",
      changes: updateFields,
      status: "pending",
      submittedAt: new Date(),
    });

    const updated = await AcademicDetails.findOneAndUpdate(
      { user_id: profile._id },
      {
        $set: updateFields,
        $setOnInsert: { user_id: profile._id },
      },
      { new: true, upsert: true }
    );

    return res.send(
      apiResponse({
        data: pendingChange,
        message: "Academic update submitted and pending approval.",
        success: true,
      })
    );
  } catch (error) {
    console.error("Error updating academic details:", error);
    return res.status(500).send(
      apiResponse({
        data: null,
        message: error.message || "Internal server error",
        success: false,
      })
    );
  }
};

export const getAllTpcProfiles = async (req, res) => {
  try {
    const tpcs = await TpcProfile.find();

    if (tpcs.length === 0) {
      return res.status(404).json(
        new apiResponse({
          success: false,
          message: "No TPC profiles found",
          status: 404,
        })
      );
    }

    const populatedTpcs = await Promise.all(
      tpcs.map(async (item) => {
        const dept = await Department.find({dept_id: item.dept_id});
        return {
          ...item.toObject(),
          dept_name: dept?.dept_name || null,
        };
      })
    );

    return res.json(
      new apiResponse({
        data: { profiles: populatedTpcs },
        message: "TPC profiles fetched",
        success: true
      })
    );
  } catch (err) {
    console.error("getAllTpcProfiles error:", err);
    return res.status(500).json(
      new apiResponse({
        success: false,
        message: "Server error",
        error: err.message,
        status: 500,
      })
    );
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.user; // assuming req.user is set by auth middleware
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).send(
        apiResponse({
          data: null,
          message: "Current and new passwords are required.",
          success: false,
        })
      );
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send(
        apiResponse({
          data: null,
          message: "User not found.",
          success: false,
        })
      );
    }

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).send(
        apiResponse({
          data: null,
          message: "Incorrect current password.",
          success: false,
        })
      );
    }

    // Validate new password strength (optional)
    if (newPassword.length < 6) {
      return res.status(400).send(
        apiResponse({
          data: null,
          message: "New password must be at least 6 characters long.",
          success: false,
        })
      );
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.send(
      apiResponse({
        data: null,
        message: "Password updated successfully.",
        success: true,
      })
    );
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).send(
      apiResponse({
        data: null,
        message: "Server error",
        success: false,
      })
    );
  }
};

export const getCollegeId = async (req, res) => {
  try {
    const userId = req.user?.userId; // Safely access userId from req.user

    if (!userId) {
      return res.status(400).send({
        data: null,
        message: "User ID not found in request",
        success: false,
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        data: null,
        message: "User not found",
        success: false,
      });
    }

    // Find the student profile linked to this user
    const student = await StudentProfile.findOne({ userId: userId });
    if (!student) {
      return res.status(404).send({
        data: null,
        message: "Student profile not found",
        success: false,
      });
    }

    // Respond with the college_id
    return res.status(200).send({
      data: {
        college_id: student.college_id,
      },
      message: "College ID fetched successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error fetching college ID:", error);
    return res.status(500).send({
      data: null,
      message: "Server error",
      success: false,
    });
  }
};