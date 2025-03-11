import express, { Application } from "express";

import { RATE_LIMITER } from "../constants/env-constants";
import { getIncidents } from "../controllers/incidents-controller";
import { createRateLimit } from "../middleware/rate-limit-middleware";

const router = express.Router();

const incidentsRoute = router.get(
    "/incidents",
    createRateLimit({ max: RATE_LIMITER.INCIDENT }),
    getIncidents as Application
);

export { incidentsRoute };
