// complete 
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['TPO', 'TPC', 'Student', 'TPF'],
    required: true
  },
  dept_id
    : { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  approved: { type: Boolean, default: null }, // null = pending, true = approved, false = rejected
  blacklisted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
