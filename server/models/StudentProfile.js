// complete 
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  college_id: String,
  f_name: String,
  l_name: String,
  m_name: String,
  mobile: String,
  dob: Date,
  address: String,
  dept_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department'},
  academicDetails: {type: mongoose.Schema.Types.ObjectId, ref: 'AcademicDetails'},
  skills: [String],
  resume: String,
  isApproved: { type: Boolean, default: false },
  isPlaced: { type: Boolean, default: false },
},{timestamps: true});

export default mongoose.model('StudentProfile', studentSchema);
