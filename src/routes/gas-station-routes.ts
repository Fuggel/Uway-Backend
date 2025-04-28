import express from "express";

import { RATE_LIMITER } from "../constants/env-constants";
import { getGasStations } from "../controllers/gas-station-controller";
import { verifyJWT } from "../middleware/jwt-middleware";
import { createRateLimit } from "../middleware/rate-limit-middleware";

const router = express.Router();

router.get("/gas-stations", createRateLimit({ max: RATE_LIMITER.GAS_STATION }), verifyJWT, getGasStations);

export { router as gasStationRoutes };
