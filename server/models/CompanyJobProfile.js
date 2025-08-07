// complete 
import { Schema, model } from 'mongoose';
import Company from './Company';

const CompanyJobProfile = new Schema({
  company_id: { type: Number, ref: 'Company', required: true },
  title: { type: String, required: true },
  description: String,
  responsibilities: String,
  requirements: [String],
  criteria: {
    min_cgpa: Number,
    min_percentage: Number,
    liveKT: Number,
    deadKT: Number,
    diploma: Boolean,
    ssc: Number,
    hsc: Number,
    diploma_percentage: Number,
  },
  location: String,
  type: String,
  ctc: Number,
  vacancies: Number,
  bond_details: String,
  skills_required: [String],
},{timestamps: true});

export default model('CompanyRoleMap', companyRoleMapSchema);
