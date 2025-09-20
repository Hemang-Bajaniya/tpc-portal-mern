// complete 
import mongoose, { mongo } from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  college_id: { type: String, default: "-" },
  f_name: { type: String, default: "Student" },
  l_name: String,
  m_name: String,
  mobile: String,
  dob: Date,
  address: String,
  dept_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  academicDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicDetails' },
  skills: [String],
  resume: String,
  approved_by: { type: mongoose.Schema.ObjectId, ref: 'TpcProfile', default: null },
  isPlaced: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('StudentProfile', studentSchema);
