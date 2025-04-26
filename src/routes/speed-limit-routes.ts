import express from "express";

import { RATE_LIMITER } from "../constants/env-constants";
import { getSpeedLimits } from "../controllers/speed-limit-controller";
import { verifyJWT } from "../middleware/jwt-middleware";
import { createRateLimit } from "../middleware/rate-limit-middleware";

const router = express.Router();

router.get("/speed-limits", createRateLimit({ max: RATE_LIMITER.SPEED_LIMIT }), verifyJWT, getSpeedLimits);

export { router as speedLimitRoutes };
