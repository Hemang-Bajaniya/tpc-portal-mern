// models/PlacementDrive.js
import { Schema, model } from 'mongoose';

// RoundInfo embedded schema
const roundInfoSchema = new Schema({
  title: { type: String, required: true },
  mode: { type: String, enum: ['Online', 'Offline'], required: true },
  round_number: { type: Number, required: true },
  date_time: { type: Date, required: true },
  location: String,
  instructions: String
}, {timestamps: true});

// Main PlacementDrive schema
const placementDriveSchema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  job_profiles: [{
    type: Schema.Types.ObjectId,
    ref: 'CompanyJobProfile'
  }],
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
