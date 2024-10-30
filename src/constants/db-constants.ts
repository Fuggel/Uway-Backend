import dotenv from "dotenv";

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const MONGODB_URI_DEV = process.env.MONGODB_URI_DEV || "";
export const MONGODB_URI_PROD = process.env.MONGODB_URI_PROD || "";
