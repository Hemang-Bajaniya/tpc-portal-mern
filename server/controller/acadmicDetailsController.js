import AcademicDetail from "../models/academicDetailsModel.js";
import StudentProfile from "../models/StudentProfile.js";

/**
 * @desc Get academic details of a student by user_id
 * @route GET /api/academic-details/:userId
 * @access Private (Student or Admin)
 */
export const getAcademicDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const studentprofile = await StudentProfile.findOne({ userId });

    if(!studentprofile){
        return res.status(400).json({
            success: false,
            message: "Student profile not found",
          }
        );
    }

    const academicDetails = await AcademicDetail.findOne({ user_id: studentprofile._id });

    if (!academicDetails) {
      return res.status(404).json({
        success: false,
        message: "Academic details not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Found",
      data: academicDetails,
    });

  } catch (error) {
    console.error("Error fetching academic details:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};