import express from "express";

import { RATE_LIMITER } from "../constants/env-constants";
import { getDirections } from "../controllers/direction-controller";
import { verifyJWT } from "../middleware/jwt-middleware";
import { createRateLimit } from "../middleware/rate-limit-middleware";

const router = express.Router();

router.get("/directions", createRateLimit({ max: RATE_LIMITER.DIRECTION }), verifyJWT, getDirections);

export { router as directionRoutes };
