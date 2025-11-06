// complete 
import { Schema, model } from 'mongoose';

const companySchema = new Schema({
  name: String,
  logo: String,
  company_description: String,
  company_website: String,
  company_location: String,
  company_type: String,
  contact_email: String,
  contact_phone: String,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default model('Company', companySchema);
