import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema({
  sem: { type: Number, required: true },
  sgpa: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  // resultFile: { type: String, default: "" }, // path to uploaded file
});

const academicDetailsSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.ObjectId, required: true, ref: "StudentProfile", unique: true },

  qualificationType: { type: String, enum: ["HSC", "Diploma"] },

  // Only one of these will be filled based on qualificationType
  hsc_percentage: { type: Number, default: null },
  diploma_cgpa: { type: Number, default: null },

  ssc_percentage: { type: Number, default: 0 },

  be_percentage: { type: Number, default: 0 },
  be_cgpa: { type: Number, default: 0 },

  liveKT: { type: Number, default: 0 },
  deadKT: { type: Number, default: 0 },

  semesters: {
    type: [semesterSchema], default: Array.from({ length: 8 }, (_, i) => ({
      sem: i + 1, sgpa: 0,
    }))
  },

  results: { type: String, default: "" }, // paths to uploaded result files for each semester

  approved: { type: String, default: "pending", enum: ["pending", "approved", "rejected"] }, 

}, { timestamps: true });

export default mongoose.model('AcademicDetail', academicDetailsSchema);