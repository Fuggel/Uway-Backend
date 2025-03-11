import express, { Application } from "express";

import { RATE_LIMITER } from "../constants/env-constants";
import { getGasStations } from "../controllers/gas-station-controller";
import { createRateLimit } from "../middleware/rate-limit-middleware";

const router = express.Router();

const gasStationsRoute = router.get(
    "/gas-stations",
    createRateLimit({ max: RATE_LIMITER.GAS_STATION }),
    getGasStations as Application
);

export { gasStationsRoute };
