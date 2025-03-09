import dotenv from "dotenv";

dotenv.config();

export const SHOW_SPEED_CAMERA_THRESHOLD_IN_METERS = Number(process.env.SHOW_SPEED_CAMERA_THRESHOLD_IN_METERS);
export const REMOVE_OLD_SPEED_CAMERAS_IN_HOURS = Number(process.env.REMOVE_OLD_SPEED_CAMERA_REPORTS_IN_HOURS);
