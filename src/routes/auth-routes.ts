import express from "express";

import { getToken } from "../controllers/auth-controller";
import { createRateLimit } from "../middleware/rate-limit-middleware";

const router = express.Router();
router.get("/get-token", createRateLimit(), getToken);

export { router as authRoutes };
