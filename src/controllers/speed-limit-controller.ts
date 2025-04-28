import { lineString, point } from "@turf/helpers";
import { distance, nearestPointOnLine } from "@turf/turf";
import { Request, Response } from "express";

import { THRESHOLD } from "../constants/env-constants";
import { fetchSpeedLimits } from "../services/speed-limit-service";
import { SpeedLimitAlert, SpeedLimitProperties, SpeedLimitRequestParams } from "../types/SpeedLimit";
import { isValidLonLat } from "../utils/geo-utils";

export const getSpeedLimits = async (req: Request, res: Response) => {
    const { lon, lat } = req.query as Partial<SpeedLimitRequestParams>;

    if (!lon || !lat) {
        res.status(400).json({ error: "Coordinates are required." });
        return;
    }

    if (!isValidLonLat(lon, lat)) {
        res.status(400).json({ error: "Invalid coordinates format." });
        return;
    }

    try {
        const featureCollection = await fetchSpeedLimits({
            userLonLat: { lon: Number(lon), lat: Number(lat) },
            distance: THRESHOLD.SPEED_LIMIT.SHOW_IN_METERS,
        });

        let closestSpeedLimit: SpeedLimitAlert | null = null;

        featureCollection?.features?.forEach((feature) => {
            if (feature.geometry.type === "LineString") {
                const userPoint = point([lon, lat]);
                const line = lineString(feature.geometry.coordinates as [[number, number]]);
                const closestPoint = nearestPointOnLine(line, userPoint);
                const distanceToLine = distance(userPoint, closestPoint, {
                    units: "meters",
                });

                const isWithinWarningDistance = distanceToLine <= THRESHOLD.SPEED_LIMIT.SHOW_IN_METERS;
                const isCloserThanPrevious = !closestSpeedLimit || distanceToLine < closestSpeedLimit.distance;

                if (isWithinWarningDistance && isCloserThanPrevious) {
                    closestSpeedLimit = {
                        distance: distanceToLine,
                        maxspeed: (feature.properties as unknown as SpeedLimitProperties).maxspeed,
                    };
                }
            }
        });

        res.json({ data: closestSpeedLimit });
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
};
