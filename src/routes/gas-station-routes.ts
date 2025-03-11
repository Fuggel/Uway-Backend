import express, { Application } from "express";

import { getGasStations } from "../controllers/gas-station-controller";

const router = express.Router();

const gasStationsRoute = router.get("/gas-stations", getGasStations as Application);

export { gasStationsRoute };
