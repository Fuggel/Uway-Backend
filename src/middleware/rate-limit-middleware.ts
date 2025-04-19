import rateLimit from "express-rate-limit";

import { INTERVAL } from "../constants/env-constants";
import { RateLimitOptions } from "../types/RateLimit";

const createRateLimit = (params?: RateLimitOptions) => {
    return rateLimit({
        windowMs: INTERVAL.RATE_LIMITER_IN_MINUTES * 60 * 1000,
        max: params?.max || 100,
        message: params?.message || "Too many requests, please try again later.",
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) => {
            return String(req.user?.id) || String(req.ip);
        },
        handler: (req, res) => {
            const user = String(req.user?.id) || String(req.ip);
            console.warn(`Rate limit exceeded by user: ${user}. IP: ${req.ip}, Time: ${new Date().toISOString()}`);
            res.status(429).json({ message: "Too many requests, please try again later." });
        },
    });
};

export { createRateLimit };
