import rateLimit from "express-rate-limit";

import { INTERVAL } from "../constants/env-constants";
import { RateLimitOptions } from "../types/RateLimit";

const createRateLimit = (params: RateLimitOptions) => {
    return rateLimit({
        windowMs: INTERVAL.RATE_LIMITER_IN_MINUTES * 60 * 1000,
        max: params.max || 100,
        message: params.message || "Too many requests, please try again later.",
        standardHeaders: true,
        legacyHeaders: false,
    });
};

export { createRateLimit };
