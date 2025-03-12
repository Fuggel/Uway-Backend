import { Request, Response } from "express";

import { THRESHOLD } from "../constants/env-constants";
import { fetchSpeedCameras } from "../services/speed-camera";
import { LonLat } from "../types/Geojson";
import { isValidLonLat } from "../utils/geo";

export const getSpeedCameras = async (req: Request, res: Response) => {
    const { lon, lat } = req.query as Partial<LonLat>;

    if (!lon || !lat) {
        return res.status(400).json({ error: "Coordinates are required." });
    }

    if (!isValidLonLat(lon, lat)) {
        return res.status(400).json({ error: "Invalid coordinates format." });
    }

    try {
        const featureCollection = await fetchSpeedCameras({
            userLonLat: { lon, lat },
            distance: THRESHOLD.SPEED_CAMERA.SHOW_IN_METERS,
        });

        return res.json({ data: featureCollection });
    } catch (error) {
        return res.status(500).json({ error: `Internal server error: ${error}` });
    }
};
