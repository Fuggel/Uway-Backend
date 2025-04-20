import { Request, Response } from "express";

import { THRESHOLD } from "../constants/env-constants";
import { fetchGasStations } from "../services/gas-station";
import { LonLat } from "../types/Geojson";
import { isValidLonLat } from "../utils/geo";

export const getGasStations = async (req: Request, res: Response) => {
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
        const featureCollection = await fetchGasStations({
            userLonLat: { lon: Number(lon), lat: Number(lat) },
            radius: THRESHOLD.GAS_STATION.SHOW_IN_KILOMETERS,
        });

        res.json({ data: featureCollection });
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
};
