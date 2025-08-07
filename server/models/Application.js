// models/Application.js
import { Schema, model } from 'mongoose';

const roundStatusSchema = new Schema({
  round_id: { type: Schema.Types.ObjectId, ref: 'Round', required: true },
  status: {
    type: String,
    enum: ['Pending', 'Selected', 'Rejected', 'Skipped'],
    default: 'Pending'
  },
}, { _id: false, timestamps: true });

const applicationSchema = new Schema({
  student_id: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  company_role_id: { type: Schema.Types.ObjectId, ref: 'CompanyRoleMap', required: true },
  round_statuses: [roundStatusSchema],
  status: {
    type: String,
    enum: ['Pending', 'Shortlisted', 'Rejected', 'Selected'],
    default: 'Pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

export default model('Application', applicationSchema);
