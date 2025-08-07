// complete 
import mongoose from 'mongoose';

const tpoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  contact: String
},{timestamps:true});

export default mongoose.model('TpoProfile', tpoSchema);
