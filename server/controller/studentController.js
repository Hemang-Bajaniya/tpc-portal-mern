import { apiResponse } from '../util/apiResponse.js';
import StudentProfile from '../models/StudentProfile.js';
import PendingChange from '../models/PendingChange.js';
import AcademicDetails from '../models/AcademicDetails.js';

export const getStudentProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const profile = await StudentProfile.findOne({ userId }).populate("dept_id");
        if (!profile)
            return res.status(404).send(new apiResponse({ data: null, message: "Profile not found" }));
        // Ensure resume path is included
        const profileObj = profile.toObject();
        profileObj.resume = profile.resume || "";
        return res.send(new apiResponse({ data: profileObj, message: "Found", success: true }));
    } catch (error) {
        return res.status(404).send(new apiResponse({ data: null, message: error }));
    }
};

export const getStudentAcademicProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const profile = await StudentProfile.findOne({ userId });
        const academicProfile = await AcademicDetails.findOne({ user_id: profile._id });
        if (!profile)
            return res.status(404).send(new apiResponse({ data: null, message: "Profile not found" }));
        // Ensure resume path is included
        return res.send(new apiResponse({ data: profile, message: "Found", success: true }));
    } catch (error) {
        return res.status(404).send(new apiResponse({ data: null, message: error }));
    }
};

export const submitAcademicChanges = async (req, res) => {
    try {
        const { userId, role } = req.user; // From auth middleware
        if (role !== "student") {
            return res.status(403).send(
                new apiResponse({ data: null, message: "Unauthorized: Only students can submit changes" })
            );
        }

        const formData = req.body;

        // Validate form data
        const changes = {
            qualificationType: formData.qualificationType || "HSC",
            ssc_percentage: Number(formData.ssc_percentage) || 0,
            hsc_percentage:
                formData.qualificationType === "HSC" ? Number(formData.hsc_percentage) || 0 : null,
            diploma_cgpa:
                formData.qualificationType === "Diploma" ? Number(formData.diploma_cgpa) || 0 : null,
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
            return res.status(400).send(
                new apiResponse({ data: null, message: "Invalid qualificationType" })
            );
        }
        if (changes.ssc_percentage < 0 || changes.ssc_percentage > 100) {
            return res.status(400).send(
                new apiResponse({ data: null, message: "SSC Percentage must be between 0 and 100" })
            );
        }
        if (changes.qualificationType === "HSC" && (changes.hsc_percentage < 0 || changes.hsc_percentage > 100)) {
            return res.status(400).send(
                new apiResponse({ data: null, message: "HSC Percentage must be between 0 and 100" })
            );
        }
        if (changes.qualificationType === "Diploma" && (changes.diploma_cgpa < 0 || changes.diploma_cgpa > 10)) {
            return res.status(400).send(
                new apiResponse({ data: null, message: "Diploma CGPA must be between 0 and 10" })
            );
        }
        if (changes.be_cgpa < 0 || changes.be_cgpa > 10) {
            return res.status(400).send(
                new apiResponse({ data: null, message: "B.E. CGPA must be between 0 and 10" })
            );
        }
        if (changes.liveKT < 0 || changes.deadKT < 0) {
            return res.status(400).send(
                new apiResponse({ data: null, message: "KTs cannot be negative" })
            );
        }
        if (
            changes.semesters.length !== 8 ||
            changes.semesters.some(
                (sem) => sem.sem < 1 || sem.sem > 8 || sem.sgpa < 0 || sem.sgpa > 10
            )
        ) {
            return res.status(400).send(
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
        return res.status(500).send(
            new apiResponse({ data: null, message: "Failed to submit academic changes" })
        );
    }
};

export const updateStudentProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const updateFields = { ...req.body };
        console.log(userId,);

        // If resume is uploaded as a file (multipart/form-data)
        if (req.file) {
            // Store relative path for frontend access
            updateFields.resume = req.file.path.replace(/\\/g, "/");
        }
        // If skills is a string, convert to array
        if (typeof updateFields.skills === 'string') {
            updateFields.skills = updateFields.skills.split(',').map(s => s.trim()).filter(Boolean);
        }
        const updated = await StudentProfile.findOneAndUpdate(
            { userId },
            { $set: updateFields },
            { new: true }
        );
        if (!updated) {
            return res.status(404).send(apiResponse({ data: null, message: "Profile not found", success: false }));
        }
        return res.send(apiResponse({ data: updated, message: "Profile updated", success: true }));
    } catch (error) {
        console.log(error);

        return res.status(500).send(apiResponse({ data: null, message: error.message, success: false }));
    }
};