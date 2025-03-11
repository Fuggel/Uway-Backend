import { Request, Response } from "express";

import { THRESHOLD } from "../constants/env-constants";
import { fetchIncidents } from "../services/incident";
import { IncidentRequestParams } from "../types/Incident";
import { isValidLonLat, splitCoordinates } from "../utils/geo";

export const getIncidents = async (req: Request, res: Response) => {
    const { coordinates: coordinatesParam } = req.query as Partial<IncidentRequestParams>;

    if (!coordinatesParam) {
        return res.status(400).json({ error: "Coordinates are required." });
    }

    const coordinates = splitCoordinates(coordinatesParam);

    if (coordinates.length !== 2 || !isValidLonLat(coordinates[0], coordinates[1])) {
        return res.status(400).json({ error: "Invalid coordinates format." });
    }

    try {
        const featureCollection = await fetchIncidents({
            userLonLat: { lon: coordinates[0], lat: coordinates[1] },
            distance: THRESHOLD.INCIDENT.SHOW_IN_METERS,
        });

        return res.json({ data: featureCollection });
    } catch (error) {
        return res.status(500).json({ error: `Internal server error: ${error}` });
    }
};
