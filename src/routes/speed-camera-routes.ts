import express, { Application } from "express";

import { RATE_LIMITER } from "../constants/env-constants";
import { getSpeedCameras } from "../controllers/speed-camera-controller";
import { createRateLimit } from "../middleware/rate-limit-middleware";

const router = express.Router();

const speedCameraRoutes = router.get(
    "/speed-cameras",
    createRateLimit({ max: RATE_LIMITER.SPEED_CAMERA }),
    getSpeedCameras as Application
);

export { speedCameraRoutes };
