import express, { Application } from "express";

import { getToken } from "../controllers/auth-controller";
import { createRateLimit } from "../middleware/rate-limit-middleware";

const router = express.Router();

const authRoute = router.get("/get-token", createRateLimit(), getToken as Application);

export { authRoute };
