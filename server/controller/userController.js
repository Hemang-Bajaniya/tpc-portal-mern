import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import TpcProfile from "../models/TpcProfile.js";
import TPFProfile from "../models/TPFProfile.js";
import AcademicDetails from "../models/AcademicDetails.js";
import { apiResponse } from "../util/apiResponse.js";

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json(
        apiResponse({
          success: false,
          message: "User ID is required.",
          status: 400,
        })
      );
    }

    const user = await User.findOne({email: userId});
    if (!user) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "User not found.",
          status: 404,
        })
      );
    }

    if (user.role === "Student") {
      const studentProfile = await StudentProfile.findOne({ userId: user._id });
      if (studentProfile) {
        await AcademicDetails.deleteMany({ user_id: studentProfile._id });
        await StudentProfile.deleteOne({ _id: studentProfile._id });
      }
    } else if (user.role === "TPC") {
      await TpcProfile.deleteOne({ userId: user._id });
    } else if (user.role === "TPF") {
      await TPFProfile.deleteOne({ userId: user._id });
    }

    await User.deleteOne({ _id: user._id });

    return res.status(200).json(
      apiResponse({
        success: true,
        message: `User with ID ${userId} deleted successfully.`,
        status: 200,
      })
    );
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json(
      apiResponse({
        success: false,
        message: "Server error.",
        error: err.message,
        status: 500,
      })
    );
  }
};
