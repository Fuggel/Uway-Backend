import express, { Application } from "express";

import { getSpeedCameras } from "../controllers/speed-camera-controller";

const router = express.Router();

const speedCameraRoutes = router.get("/speed-cameras", getSpeedCameras as Application);

export { speedCameraRoutes };
