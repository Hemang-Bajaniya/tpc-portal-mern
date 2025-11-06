// models/PendingChange.js
import mongoose from "mongoose";

const pendingChangeSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "StudentProfile", required: true },
    dept_id: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    type: { type: String, enum: ["academic"], required: true }, // e.g., "profile" or "academic"
    changes: { type: mongoose.Schema.Types.Mixed, required: true }, // JSON of proposed changes (e.g., { f_name: "New Name", ... })
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    submittedAt: { type: Date, default: Date.now },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "TpcProfile" },
    reviewedAt: { type: Date },
    rejectionReason: { type: String },
}, { timestamps: true });

export default mongoose.model("PendingChange", pendingChangeSchema);