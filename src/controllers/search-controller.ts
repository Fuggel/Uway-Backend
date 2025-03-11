import { Request, Response } from "express";

import { fetchSearchLocation, fetchSearchSuggestion } from "../services/search";
import { SearchLocationRequestParams, SearchSuggestionRequestParams } from "../types/Search";
import { isValidLonLat } from "../utils/geo";

export const getSearchSuggestions = async (req: Request, res: Response) => {
    const { query, sessionToken, coordinates: coordinatesParam } = req.query as Partial<SearchSuggestionRequestParams>;

    if (!coordinatesParam) {
        return res.status(400).json({ error: "Coordinates are required." });
    }

    const coordinates = coordinatesParam.split(",").map(Number) as [number, number];

    if (coordinates.length !== 2 || !isValidLonLat(coordinates[0], coordinates[1])) {
        return res.status(400).json({ error: "Invalid coordinates format." });
    }

    if (!query || !sessionToken) {
        return res.status(400).json({ error: "Query and session token are required." });
    }

    try {
        const suggestions = await fetchSearchSuggestion({
            query,
            sessionToken,
            lngLat: { lon: coordinates[0], lat: coordinates[1] },
        });
        return res.json({ data: suggestions });
    } catch (error) {
        return res.status(500).json({ error: `Internal server error: ${error}` });
    }
};

export const getSearchLocations = async (req: Request, res: Response) => {
    const { mapboxId, sessionToken } = req.query as Partial<SearchLocationRequestParams>;

    if (!mapboxId || !sessionToken) {
        return res.status(400).json({ error: "Mapbox ID and session token are required." });
    }

    try {
        const locations = await fetchSearchLocation({ mapboxId, sessionToken });
        return res.json({ data: locations });
    } catch (error) {
        return res.status(500).json({ error: `Internal server error: ${error}` });
    }
};
