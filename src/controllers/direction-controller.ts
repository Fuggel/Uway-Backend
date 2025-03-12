import { Request, Response } from "express";

import { fetchDirections } from "../services/direction";
import { DirectionRequestParams } from "../types/Direction";
import { isValidLonLat, splitCoordinates } from "../utils/geo";

export const getDirections = async (req: Request, res: Response) => {
    const {
        profile,
        startCoordinates: startCoordinatesParam,
        destinationCoordinates: destinationCoordinatesParam,
        excludeTypes,
        waypoint,
    } = req.query as Partial<DirectionRequestParams>;

    if (!startCoordinatesParam || !destinationCoordinatesParam) {
        return res.status(400).json({ error: "Start and destination coordinates are required." });
    }

    const startCoordinates = splitCoordinates(startCoordinatesParam as string);
    const destinationCoordinates = splitCoordinates(destinationCoordinatesParam as string);
    const waypointCoordinates = waypoint ? splitCoordinates(waypoint as string) : undefined;

    if (!profile) {
        return res.status(400).json({ error: "Profile is required." });
    }

    if (startCoordinates.length !== 2 || !isValidLonLat(startCoordinates[0], startCoordinates[1])) {
        return res.status(400).json({ error: "Invalid start coordinates format." });
    }

    if (destinationCoordinates.length !== 2 || !isValidLonLat(destinationCoordinates[0], destinationCoordinates[1])) {
        return res.status(400).json({ error: "Invalid destination coordinates format." });
    }

    try {
        const directions = await fetchDirections({
            profile,
            startLngLat: { lon: Number(startCoordinates[0]), lat: Number(startCoordinates[1]) },
            destinationLngLat: { lon: Number(destinationCoordinates[0]), lat: Number(destinationCoordinates[1]) },
            excludeTypes,
            waypoint: waypointCoordinates
                ? { lon: Number(waypointCoordinates[0]), lat: Number(waypointCoordinates[1]) }
                : undefined,
        });
        return res.json({ data: directions });
    } catch (error) {
        return res.status(500).json({ error: `Internal server error: ${error}` });
    }
};
