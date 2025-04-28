import { Request, Response } from "express";

import { THRESHOLD } from "../constants/env-constants";
import { fetchIncidents } from "../services/incident-service";
import { LonLat } from "../types/Geojson";
import { isValidLonLat } from "../utils/geo-utils";

export const getIncidents = async (req: Request, res: Response) => {
    const { lon, lat } = req.query as Partial<LonLat>;

    if (!lon || !lat) {
        res.status(400).json({ error: "Coordinates are required." });
        return;
    }

    if (!isValidLonLat(lon, lat)) {
        res.status(400).json({ error: "Invalid coordinates format." });
        return;
    }

    try {
        const featureCollection = await fetchIncidents({
            userLonLat: { lon: Number(lon), lat: Number(lat) },
            distance: THRESHOLD.INCIDENT.SHOW_IN_METERS,
        });

        res.json({ data: featureCollection });
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
};
