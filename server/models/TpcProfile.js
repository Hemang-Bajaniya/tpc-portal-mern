// complete 
import mongoose, { Mongoose } from 'mongoose';

const tpcSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  gender: { type: String, enum: ['M', 'F', 'O'], required: true },
  dept: { type: mongoose.Schema.Types.ObjectId, ref:'Department', required: true },
  mobile: String,
  isApproved: { type: Boolean, default: false }
});

export default mongoose.model('TpcProfile', tpcSchema);
