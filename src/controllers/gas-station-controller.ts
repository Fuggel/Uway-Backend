import { Request, Response } from "express";

import { THRESHOLD } from "../constants/env-constants";
import { fetchGasStations } from "../services/gas-station";
import { GasStationRequestParams } from "../types/GasStation";
import { isValidLonLat, splitCoordinates } from "../utils/geo";

export const getGasStations = async (req: Request, res: Response) => {
    const { coordinates: coordinatesParam } = req.query as Partial<GasStationRequestParams>;

    if (!coordinatesParam) {
        return res.status(400).json({ error: "Coordinates are required." });
    }

    const coordinates = splitCoordinates(coordinatesParam);

    if (coordinates.length !== 2 || !isValidLonLat(coordinates[0], coordinates[1])) {
        return res.status(400).json({ error: "Invalid coordinates format." });
    }

    try {
        const featureCollection = await fetchGasStations({
            userLonLat: { lon: coordinates[0], lat: coordinates[1] },
            radius: THRESHOLD.GAS_STATION.SHOW_IN_KILOMETERS,
        });

        return res.json({ data: featureCollection });
    } catch (error) {
        return res.status(500).json({ error: `Internal server error: ${error}` });
    }
};
