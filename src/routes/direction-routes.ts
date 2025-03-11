import express, { Application } from "express";

import { getDirections } from "../controllers/direction-controller";

const router = express.Router();

const directionRoute = router.get("/directions", getDirections as Application);

export { directionRoute };
