import cors from "cors";
import express from "express";

import { getSpeedCamerasRoute, reportSpeedCameraRoute } from "./routes/speed-camera-routes";
import { startRemoveOldMobileCameras } from "./tasks/removeOldCameras";
import connectDB from "./utils/db";

const app = express();
const PORT = process.env.PORT || 3001;

startRemoveOldMobileCameras();

app.use(cors());
app.use(express.json());

app.use("/api", getSpeedCamerasRoute);
app.use("/api", reportSpeedCameraRoute);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(`Failed to connect to database: ${error}`);
        process.exit(1);
    });
