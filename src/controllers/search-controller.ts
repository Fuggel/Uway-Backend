import { Request, Response } from "express";

import { fetchSearchLocation, fetchSearchSuggestion } from "../services/search-service";
import { SearchLocationRequestParams, SearchSuggestionRequestParams } from "../types/Search";
import { isValidLonLat } from "../utils/geo-utils";

export const getSearchSuggestions = async (req: Request, res: Response) => {
    const { query, sessionToken, lon, lat } = req.query as Partial<SearchSuggestionRequestParams>;

    if (!lon || !lat) {
        res.status(400).json({ error: "Coordinates are required." });
        return;
    }

    if (!isValidLonLat(lon, lat)) {
        res.status(400).json({ error: "Invalid coordinates format." });
        return;
    }

    if (!query || !sessionToken) {
        res.status(400).json({ error: "Query and session token are required." });
        return;
    }

    try {
        const suggestions = await fetchSearchSuggestion({
            query,
            sessionToken,
            lngLat: { lon: Number(lon), lat: Number(lat) },
        });
        res.json({ data: suggestions });
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
};

export const getSearchLocations = async (req: Request, res: Response) => {
    const { mapboxId, sessionToken } = req.query as Partial<SearchLocationRequestParams>;

    if (!mapboxId || !sessionToken) {
        res.status(400).json({ error: "Mapbox ID and session token are required." });
        return;
    }

    try {
        const locations = await fetchSearchLocation({ mapboxId, sessionToken });
        res.json({ data: locations });
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
};
