import express, { Application } from "express";

import { RATE_LIMITER } from "../constants/env-constants";
import { getSearchLocations, getSearchSuggestions } from "../controllers/search-controller";
import { createRateLimit } from "../middleware/rate-limit-middleware";

const router = express.Router();

const searchSuggestionsRoute = router.get(
    "/search-suggestions",
    createRateLimit({ max: RATE_LIMITER.SEARCH }),
    getSearchSuggestions as Application
);
const searchLocationsRoute = router.get(
    "/search-locations",
    createRateLimit({ max: RATE_LIMITER.SEARCH }),
    getSearchLocations as Application
);

export { searchLocationsRoute, searchSuggestionsRoute };
