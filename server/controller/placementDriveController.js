// controllers/placementDriveController.js
import PlacementDrive from "../models/Drive.js";
import CompanyJobProfile from "../models/CompanyJobProfile.js";

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
      return res.status(400).json({ message: "Job profile ID is required" });
    }

    const drive = await PlacementDrive.findOne({ job_profile: jobId });

    if (!drive) {
      return res.status(404).json({ message: "Placement drive not found" });
    }

    return res.status(200).json({ message: "Placement drive fetched", data: drive });
  } catch (err) {
    console.error("Error fetching placement drive:", err);
    return res.status(500).json({ message: "Internal server error" });
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
