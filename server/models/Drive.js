// models/PlacementDrive.js
import { Schema, model } from 'mongoose';
import CompanyJobProfile from './CompanyJobProfile.js';

// RoundInfo embedded schema
const roundInfoSchema = new Schema({
  title: { type: String, required: true },
  mode: { type: String, enum: ['Online', 'Offline'], required: true },
  round_number: { type: Number, required: true },
  date_time: { type: Date, required: true },
  location: String,
  instructions: String,
  status: {
    type: String,
    enum: ['Pending', 'Ongoing', 'Completed'],
    default: 'Pending'
  },
  // student_id: [{type: Schema.Types.ObjectId, ref: 'Student'}]
  applications: [{ type: Schema.Types.ObjectId, ref: 'Application' }],
  selected: [{ type: Schema.Types.ObjectId, ref: 'Application' }]
}, { timestamps: true });

// Main PlacementDrive schema
const placementDriveSchema = new Schema({
  company: {  
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  job_profile: {
    type: Schema.Types.ObjectId,
    ref: CompanyJobProfile,
  },
  drive_title: {
    type: String,
    required: true
  },
  description: String,
  hiring_process: [roundInfoSchema],
  drive_date: {
    type: Date,
    required: true
  },
  last_date_to_apply: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed'],
    default: 'Upcoming'
  },
}, { timestamps: true });

export default model('PlacementDrive', placementDriveSchema);
