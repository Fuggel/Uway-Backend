import mongoose, { Document, Schema } from "mongoose";

import { SpeedCameraType } from "../types/ISpeedCamera";

export interface ISpeedCamera extends Document {
    deviceId: string;
    timestamp: Date;
    coordinates: [number, number];
    direction: number;
    type: SpeedCameraType;
    address: string;
}

const SpeedCameraSchema: Schema = new Schema({
    deviceId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    coordinates: { type: [Number], required: true },
    direction: { type: Number, required: true },
    type: { type: String, enum: Object.values(SpeedCameraType), required: true },
    address: { type: String, required: true },
});

export const SpeedCamera = mongoose.model<ISpeedCamera>("SpeedCamera", SpeedCameraSchema, "speed-cameras");
