import express, { Application } from "express";

import { getSpeedCameras, reportSpeedCamera } from "../controllers/speed-camera-controller";

const router = express.Router();

const getSpeedCamerasRoute = router.get("/speed-cameras", getSpeedCameras as Application);
const reportSpeedCameraRoute = router.post("/report-speed-camera", reportSpeedCamera as Application);

export { getSpeedCamerasRoute, reportSpeedCameraRoute };
