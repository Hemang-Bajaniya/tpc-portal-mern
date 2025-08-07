// complete 
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['TPO', 'TPC', 'Student'],
    required: true
  },
  approved: { type: Boolean, default: false },
  blacklisted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, {timestamps: true});

export default mongoose.model('User', userSchema);
