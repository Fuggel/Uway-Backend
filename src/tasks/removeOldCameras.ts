import { DateTime } from "luxon";
import cron from "node-cron";

import { REMOVE_OLD_SPEED_CAMERAS_IN_HOURS } from "../constants/speed-camera-constants";
import { SpeedCamera } from "../models/speed-camera";

const removeOldMobileCameras = async () => {
    try {
        const cutoffTime = DateTime.now().minus({ hours: REMOVE_OLD_SPEED_CAMERAS_IN_HOURS }).toJSDate();

        const result = await SpeedCamera.deleteMany({
            type: "mobile",
            timestamp: { $lt: cutoffTime },
        });

        if (result.deletedCount > 0) {
            console.log(`Removed ${result.deletedCount} old mobile cameras.`);
        }
    } catch (error) {
        console.error(`Failed to remove old mobile cameras: ${error}`);
    }
};

export const startRemoveOldMobileCameras = () => {
    cron.schedule("*/15 * * * *", removeOldMobileCameras);
};
