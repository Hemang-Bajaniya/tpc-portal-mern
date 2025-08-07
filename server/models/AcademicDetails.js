// complete 
import { Schema, model } from "mongoose";

const academicDetailsSchema = new Schema(
  {
    uid: { type: String, required: true, ref: "StudentProfile" },
    be_percentage: Number,
    be_cgpa: Number,
    hsc_percentage: Number,
    diploma_percentage: Number,
    ssc_percentage: Number,
    liveKT: Number,
    deadKT: Number,
  },
  { timestamps: true }
);

export default model("AcademicDetails", academicDetailsSchema);
