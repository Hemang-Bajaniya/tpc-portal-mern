import mongoose from "mongoose";
import CompanyJobProfile from "./CompanyJobProfile.js";

const placedStudentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    jobProfileId: { type: mongoose.Schema.Types.ObjectId, ref: CompanyJobProfile, required: true },
}, { timestamps: true });

export default mongoose.model('PlacedStudent', placedStudentSchema);