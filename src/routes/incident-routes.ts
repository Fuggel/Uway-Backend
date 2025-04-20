import express from "express";

import { RATE_LIMITER } from "../constants/env-constants";
import { getIncidents } from "../controllers/incidents-controller";
import { verifyJWT } from "../middleware/jwt-middleware";
import { createRateLimit } from "../middleware/rate-limit-middleware";

const router = express.Router();

router.get("/incidents", createRateLimit({ max: RATE_LIMITER.INCIDENT }), verifyJWT, getIncidents);

export { router as incidentsRoutes };
