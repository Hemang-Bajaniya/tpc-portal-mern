// complete 
import { Schema, model } from 'mongoose';

const departmentSchema = new Schema({
  dept_id: { type: String, required: true, unique: true },
  dept_name: String,
},{ timestamps: true});

export default model('Department', departmentSchema);