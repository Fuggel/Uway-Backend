import express, { Application } from "express";

import { getSearchLocations, getSearchSuggestions } from "../controllers/search-controller";

const router = express.Router();

const searchSuggestionsRoute = router.get("/search-suggestions", getSearchSuggestions as Application);
const searchLocationsRoute = router.get("/search-locations", getSearchLocations as Application);

export { searchLocationsRoute, searchSuggestionsRoute };
