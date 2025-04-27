import { Request, Response } from "express";

import { fetchSpeedLimits } from "../services/speed-limit";
import { SpeedLimitRequestParams } from "../types/SpeedLimit";
import { isValidLonLat, simplifyGeometry } from "../utils/geo";

export const getSpeedLimits = async (req: Request, res: Response) => {
    const { lon, lat, distance } = req.query as Partial<SpeedLimitRequestParams>;

    if (!lon || !lat) {
        res.status(400).json({ error: "Coordinates are required." });
        return;
    }

    if (!isValidLonLat(lon, lat)) {
        res.status(400).json({ error: "Invalid coordinates format." });
        return;
    }

    if (!distance || isNaN(Number(distance))) {
        res.status(400).json({ error: "Distance is required and should be a number." });
        return;
    }

    try {
        const featureCollection = await fetchSpeedLimits({
            userLonLat: { lon: Number(lon), lat: Number(lat) },
            distance: Number(distance),
        });

        const opzimizedSpeedLimits = featureCollection.features.map((feature) => {
            return {
                ...feature,
                geometry: simplifyGeometry(feature.geometry as GeoJSON.LineString, 0.00001),
            };
        });

        res.json({ data: { type: "FeatureCollection", features: opzimizedSpeedLimits } });
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
};
