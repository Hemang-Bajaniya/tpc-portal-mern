import mongoose from "mongoose";
import StudentProfile from "./StudentProfile.js";
import Company from "./Company.js";
import CompanyJobProfile from "./CompanyJobProfile.js";

const placedStudentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    jobProfileId: { type: mongoose.Schema.Types.ObjectId, ref: CompanyJobProfile, required: true },
}, { timestamps: true });

export default mongoose.model('PlacedStudent', placedStudentSchema);