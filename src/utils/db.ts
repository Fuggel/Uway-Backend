import mongoose from "mongoose";

import { MONGODB_URI_DEV, MONGODB_URI_PROD, NODE_ENV } from "../constants/db-constants";

const connectDB = async () => {
    try {
        const mongoUri = NODE_ENV === "production" ? MONGODB_URI_PROD : MONGODB_URI_DEV;
        await mongoose.connect(mongoUri);

        console.log(`${NODE_ENV}: DB connected`);
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error}`);
        process.exit(1);
    }
};

export default connectDB;
