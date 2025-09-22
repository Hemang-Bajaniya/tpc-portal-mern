// complete 
import { Schema, model } from 'mongoose';

const CompanyJobProfileSchema = new Schema({
  company_id: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
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
  last_date_for_application: Date,
  for_dept: [{type: Schema.Types.ObjectId, ref: 'Department', required: true}]
},{timestamps: true});

export default model('CompanyJobProfile', CompanyJobProfileSchema);