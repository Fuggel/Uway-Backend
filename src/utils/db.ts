import mongoose from "mongoose";

import { MONGODB_URI } from "../constants/api-constants";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error}`);
        process.exit(1);
    }
};

export default connectDB;
