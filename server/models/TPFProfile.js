import mongoose from 'mongoose';

const tpfProfile = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        dept_id: {
            type: mongoose.Schema.ObjectId,
            ref: 'Department',
            required: true
        },
    }, { timestamps: true }
);

export default mongoose.model("TPFProfile", tpfProfile);