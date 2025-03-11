import express, { Application } from "express";

import { getIncidents } from "../controllers/incidents-controller";

const router = express.Router();

const incidentsRoute = router.get("/incidents", getIncidents as Application);

export { incidentsRoute };
