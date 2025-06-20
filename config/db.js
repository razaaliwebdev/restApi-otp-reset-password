import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully...");
    } catch (error) {
        console.log("Failed to connect DB...", error);
    };
};

export default connectDB;