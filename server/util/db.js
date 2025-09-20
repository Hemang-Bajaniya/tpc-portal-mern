import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb connected");
    } catch (error) {
        console.log("Mongodb error: ", error);
        process.exit(1);
    }
};

export default connectDB;