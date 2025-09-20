// complete 
import mongoose, { Mongoose } from 'mongoose';

const tpcSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  gender: { type: String, enum: ['M', 'F', 'O'], },
  dept_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  mobile: String,
}, { timestamps: true });

export default mongoose.model('TpcProfile', tpcSchema);
