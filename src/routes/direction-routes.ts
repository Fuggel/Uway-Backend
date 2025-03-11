import express, { Application } from "express";

import { RATE_LIMITER } from "../constants/env-constants";
import { getDirections } from "../controllers/direction-controller";
import { createRateLimit } from "../middleware/rate-limit-middleware";

const router = express.Router();

const directionRoute = router.get(
    "/directions",
    createRateLimit({ max: RATE_LIMITER.DIRECTION }),
    getDirections as Application
);

export { directionRoute };
