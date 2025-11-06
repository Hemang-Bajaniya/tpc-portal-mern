// complete 
import mongoose, { Schema, model } from 'mongoose';

const CompanyJobProfile = new Schema({
  company_id: { type: mongoose.Schema.ObjectId, ref: 'Company', required: true },
  title: { type: String, required: true },
  description: String,
  responsibilities: [String],
  requirements: [String],
  criteria: {
    min_cgpa: Number,
    min_percentage: Number,
    liveKT: Number,
    deadKT: Number,
    diploma: Boolean, 
    ssc: Number,
    hsc: Number,
    diploma_percentage: Number,
  },
  location: String,
  type: String,
  ctc: Number,
  vacancies: Number,
  bond_details: String,
  skills_required: [String],
  status: {
    type: String,
    enum: ['Active' ,'Inactive'],
    default: 'Active'
  },
  placement_drive_status: {
    type: String,
    enum: ['Pending', 'Sheduled'],
    default: 'Pending'
  },
  for_dept: [{ type: mongoose.Schema.ObjectId, ref: 'Department', required: true }]
}, { timestamps: true });

export default model('CompnayJobProfile', CompanyJobProfile);
