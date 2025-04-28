import { Request, Response } from "express";

import { THRESHOLD } from "../constants/env-constants";
import { fetchGasStations } from "../services/gas-station-service";
import { GasStation } from "../types/GasStation";
import { LonLat } from "../types/Geojson";
import { getStationIcon } from "../utils/gas-station-utils";
import { isValidLonLat } from "../utils/geo-utils";

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

        const gasStations = featureCollection.features.map((feature) => {
            const { properties } = feature;
            const iconType = getStationIcon(
                featureCollection.features.map((f) => f.properties as unknown as GasStation),
                (properties as unknown as GasStation).diesel
            );

            return {
                ...feature,
                properties: { ...properties, iconType },
            };
        });

        res.json({ data: { type: "FeatureCollection", features: gasStations } });
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
};
