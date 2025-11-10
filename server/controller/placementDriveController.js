// controllers/placementDriveController.js
import PlacementDrive from "../models/Drive.js";
import CompanyJobProfile from "../models/CompanyJobProfile.js";
import Application from "../models/Application.js";
import StudentProfile from "../models/StudentProfile.js";
import Company from "../models/Company.js";

// Add a new Placement Drive
export const addPlacementDrive = async (req, res) => {
  try {
    const { job_profile, drive_title, description, drive_date, status } =
      req.body;

    if (!job_profile || !drive_title || !drive_date) {
      return res
        .status(400)
        .json({
          message: "Job profile, drive title, and drive date are required",
        });
    }

    // Optional: verify job_profile exists
    const jobProfileExists = await CompanyJobProfile.findById(job_profile);
    if (!jobProfileExists) {
      return res.status(404).json({ message: "Job profile not found" });
    }

    const newDrive = new PlacementDrive({
      company: jobProfileExists.company_id,
      job_profile,
      drive_title,
      description,
      drive_date,
      status: status || "Upcoming",
    });

    const savedDrive = await newDrive.save();

    jobProfileExists.status = "Sheduled";
    await jobProfileExists.save();

    return res
      .status(201)
      .json({
        message: "Placement drive added successfully",
        data: savedDrive,
      });
  } catch (err) {
    console.error("Error adding placement drive:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPlacementDriveByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ message: "Job profile ID is required", data: null });
    }

    const drive = await PlacementDrive.findOne({ job_profile: jobId });

    // Return empty data instead of 404 if not found
    if (!drive) {
      return res.status(200).json({ message: "Placement drive not found", data: null });
    }

    return res.status(200).json({ message: "Placement drive fetched", data: drive });
  } catch (err) {
    console.error("Error fetching placement drive:", err);
    return res.status(500).json({ message: "Internal server error", data: null });
  }
};

export const updatePlacementDrive = async (req, res) => {
  try {
    const { driveId } = req.params;
    const { drive_title, description, drive_date, status } = req.body;

    if (!driveId) {
      return res.status(400).json({ message: "Placement drive ID is required" });
    }

    // Find the drive
    const drive = await PlacementDrive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ message: "Placement drive not found" });
    }

    // Update fields
    if (drive_title !== undefined) drive.drive_title = drive_title;
    if (description !== undefined) drive.description = description;
    if (drive_date !== undefined) drive.drive_date = new Date(drive_date);
    if (status !== undefined) drive.status = status;

    // Save updated drive
    await drive.save();

    return res.status(200).json({ message: "Placement drive updated successfully", data: drive });
  } catch (err) {
    console.error("Error updating placement drive:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch all rounds of a placement drive
export const getRoundsByDrive = async (req, res) => {
  const { driveId } = req.params;

  try {
    // Find the placement drive by its ID
    const drive = await PlacementDrive.findById(driveId);

    if (!drive) {
      return res.status(404).json({ message: "Placement drive not found" });
    }

    // Return the hiring_process array (all rounds)
    res.status(200).json({ success: true, data: drive.hiring_process });
  } catch (err) {
    console.error("Error fetching rounds:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller to get a drive by ID
export const getDriveById = async (req, res) => {
  const { driveId } = req.params;

  if (!driveId) {
    return res.status(400).json({ message: "Drive ID is required" });
  }

  try {
    const drive = await PlacementDrive.findById(driveId);

    if (!drive) {
      return res.status(404).json({ message: "Placement drive not found" });
    }

    return res.status(200).json({ data: drive });
  } catch (err) {
    console.error("Error fetching placement drive:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateRoundEmbedded = async (req, res) => {
  const { driveId, roundId } = req.params;
  const updateData = req.body;

  try {
    const drive = await PlacementDrive.findById(driveId);
    if (!drive) return res.status(404).json({ message: "Drive not found" });

    if (!Array.isArray(drive.hiring_process)) {
      return res.status(400).json({ message: "Drive has no hiring process array" });
    }

    const round = drive.hiring_process.id(roundId);
    if (!round) return res.status(404).json({ message: "Round not found" });

    delete updateData._id; // prevent accidental _id overwrite
    Object.assign(round, updateData);
    await drive.save();

    return res.status(200).json({ data: round });
  } catch (err) {
    console.error("Error updating round:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a round inside a drive
export const deleteRoundEmbedded = async (req, res) => {
  const { driveId, roundId } = req.params;

  try {
    const drive = await PlacementDrive.findById(driveId);
    if (!drive) return res.status(404).json({ message: "Drive not found" });

    if (!Array.isArray(drive.hiring_process)) {
      return res.status(400).json({ message: "Drive has no hiring process array" });
    }

    const round = drive.hiring_process.id(roundId);
    if (!round) return res.status(404).json({ message: "Round not found" });

    // ✅ Remove the round safely
    round.deleteOne(); // replaces deprecated round.remove()

    await drive.save();

    return res.status(200).json({ message: "Round deleted successfully" });
  } catch (err) {
    console.error("Error deleting round:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// controllers/placementDriveController.js
export const addRoundEmbedded = async (req, res) => {
  const { driveId } = req.params;
  const roundData = req.body;

  try {
    // ✅ Find the parent drive
    const drive = await PlacementDrive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    // ✅ Validate / sanitize the new round
    const newRound = {
      title: roundData.title || "Untitled Round",
      mode: roundData.mode || "Online",
      round_number: roundData.round_number || drive.hiring_process.length + 1,
      date_time: roundData.date_time || new Date(),
      location: roundData.location || "",
      instructions: roundData.instructions || "",
      status: roundData.status || "Pending",
      applications: roundData.applications || [],
      selected: roundData.selected || [],
    };

    // ✅ Push into the embedded array
    drive.hiring_process.push(newRound);

    // ✅ Save parent document
    await drive.save();

    // ✅ Get the newly added round (last item)
    const addedRound = drive.hiring_process[drive.hiring_process.length - 1];

    return res.status(201).json({
      message: "Round added successfully",
      data: addedRound,
    });
  } catch (err) {
    console.error("Error adding round:", err);
    return res.status(500).json({
      message: "Server error while adding round",
      error: err.message,
    });
  }
};

export const getRoundApplications = async (req, res) => {
  try {
    const { driveId, roundId } = req.params;

    const drive = await PlacementDrive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ message: "Placement drive not found" });
    }

    const round = drive.hiring_process.id(roundId);
    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    let applications = [];

    if (round.round_number === 1) {
      applications = await Application.find({
        job_profile_id: drive.job_profile,
      }).lean();
    } else {
      const prevRound = drive.hiring_process.find(
        (r) => r.round_number === round.round_number - 1
      );

      if (!prevRound) {
        return res
          .status(400)
          .json({ message: "Previous round not found for this drive" });
      }

      applications = await Application.find({
        _id: { $in: prevRound.selected },
      }).lean();
    }

    const studentIds = applications.map((app) => app.student_id);

    const students = await StudentProfile.find(
      { _id: { $in: studentIds } },
      { _id: 1, f_name: 1, l_name: 1, college_id: 1 }
    ).lean();

    const applicationsWithStudents = applications.map((app) => {
      const student = students.find(
        (s) => s._id.toString() === app.student_id.toString()
      );
      return {
        ...app,
        student_name: student
          ? `${student.f_name || ""} ${student.l_name || ""}`.trim()
          : "Unknown Student",
        college_id: student?.college_id || "-",
      };
    });

    return res.status(200).json({
      data: applicationsWithStudents,
      round,
    });
  } catch (err) {
    console.error("Error fetching round applications:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update round selection and reject unselected applications
export const updateRoundApplications = async (req, res) => {
  try {
    const { driveId, roundId } = req.params;
    const { selected } = req.body; // array of selected application IDs

    if (!Array.isArray(selected)) {
      return res.status(400).json({ message: "Selected must be an array" });
    }

    const drive = await PlacementDrive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ message: "Placement drive not found" });
    }

    const round = drive.hiring_process.id(roundId);
    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    // Update the selected applications in the round
    round.selected = selected;

    // Save the drive after updating the round
    await drive.save();

    // Update application statuses
    // 1. Mark selected applications as 'selected'
    await Application.updateMany(
      { _id: { $in: selected } },
      { $set: { status: "Shortlisted" } }
    );

    // 2. Mark unselected applications as 'rejected'
    const allAppIds =
      round.round_number === 1
        ? (await Application.find({ job_profile_id: drive.job_profile }, "_id")).map(
            (a) => a._id
          )
        : round.round_number > 1
        ? (await Application.find({ _id: { $in: drive.hiring_process[round.round_number - 2].selected } }, "_id")).map(
            (a) => a._id
          )
        : [];

    const unselectedIds = allAppIds.filter((id) => !selected.includes(id.toString()));

    await Application.updateMany(
      { _id: { $in: unselectedIds } },
      { $set: { status: "Rejected" } }
    );

    res.status(200).json({ message: "Round selection updated and unselected applications rejected" });
  } catch (err) {
    console.error("Error updating round applications:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH - add new application IDs (push into existing)
export const addRoundApplications = async (req, res) => {
  try {
    const { driveId, roundId } = req.params;
    const { newApplications } = req.body; // array of application IDs

    const drive = await PlacementDrive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ message: "Placement drive not found" });
    }

    const round = drive.hiring_process.id(roundId);
    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    if (newApplications?.length > 0) {
      round.applications.push(...newApplications);
    }

    await drive.save();
    res.status(200).json({ message: "Applications added to round", round });
  } catch (err) {
    console.error("Error adding round applications:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDriveWithSelectedStudents = async (req, res) => {
  try {
    const { driveId } = req.params;

    // Find the drive using job_profile
    const drive = await PlacementDrive.findOne({ job_profile: driveId }).lean(); // use lean() for plain JS object
    if (!drive) {
      return res.status(404).json({ message: "Placement drive not found" });
    }

    // For each round, fetch selected students
    const roundsWithStudents = await Promise.all(
      drive.hiring_process.map(async (round) => {
        if (!round.selected || round.selected.length === 0) {
          return { ...round, selected_students: [] };
        }

        // Fetch applications for this round
        const applications = await Application.find({
          _id: { $in: round.selected },
        }).lean();

        // Get student IDs from applications
        const studentIds = applications.map((app) => app.student_id);

        // Fetch student profiles
        const students = await StudentProfile.find(
          { _id: { $in: studentIds } },
          { _id: 1, f_name: 1, l_name: 1, college_id: 1 }
        ).lean();

        // Map applications to include student info
        const selected_students = applications.map((app) => {
          const student = students.find(
            (s) => s._id.toString() === app.student_id.toString()
          );
          return {
            application_id: app._id,
            student_name: student
              ? `${student.f_name || ""} ${student.l_name || ""}`.trim()
              : "Unknown Student",
            college_id: student?.college_id || "-",
          };
        });

        // Return full round info + selected students
        return { ...round, selected_students };
      })
    );

    // Include all drive fields + updated rounds
    const driveWithStudents = { ...drive, hiring_process: roundsWithStudents };

    res.status(200).json({ data: driveWithStudents });
  } catch (err) {
    console.error("Error fetching drive with students:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOngoingDrives = async (req, res) => {
  try {
    const drives = await PlacementDrive.find({ status: "Ongoing" }).lean();

    if (!drives.length) {
      return res.status(200).json({
        success: false,
        message: "No ongoing placement drives found",
        data: [],
      });
    }

    const jobProfileIds = drives.map((d) => d.job_profile).filter(Boolean);
    const companyIds = drives.map((d) => d.company).filter(Boolean);

    const [companies, jobProfiles] = await Promise.all([
      Company.find(
        { _id: { $in: companyIds } },
        { _id: 1, name: 1, logo: 1 }
      ).lean(),
      CompanyJobProfile.find(
        { _id: { $in: jobProfileIds } },
        { _id: 1, title: 1 }
      ).lean(),
    ]);

    const drivesWithInfo = drives.map((drive) => {
      const company = companies.find(
        (c) => c._id.toString() === drive.company?.toString()
      );
      const jobProfile = jobProfiles.find(
        (j) => j._id.toString() === drive.job_profile?.toString()
      );

      return {
        _id: drive._id,
        drive_title: drive.drive_title,
        description: drive.description,
        drive_date: drive.drive_date,
        status: drive.status,
        hiring_process: drive.hiring_process || [],
        company: company
          ? {
              name: company.name || "Unknown Company",
              logo: company.logo || null,
            }
          : null,
        job_profile: jobProfile
          ? {
              _id: jobProfile._id,
              title: jobProfile.title || "N/A",
            }
          : null,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Ongoing placement drives fetched successfully",
      data: drivesWithInfo,
    });
  } catch (error) {
    console.error("Error fetching ongoing drives:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching ongoing drives",
      data: null,
    });
  }
};