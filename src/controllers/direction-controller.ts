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
        res.status(400).json({ error: "Start and destination coordinates are required." });
        return;
    }

    const startCoordinates = splitCoordinates(startCoordinatesParam as string);
    const destinationCoordinates = splitCoordinates(destinationCoordinatesParam as string);
    const waypointCoordinates = waypoint ? splitCoordinates(waypoint as string) : undefined;

    if (!profile) {
        res.status(400).json({ error: "Profile is required." });
        return;
    }

    if (startCoordinates.length !== 2 || !isValidLonLat(startCoordinates[0], startCoordinates[1])) {
        res.status(400).json({ error: "Invalid start coordinates format." });
        return;
    }

    if (destinationCoordinates.length !== 2 || !isValidLonLat(destinationCoordinates[0], destinationCoordinates[1])) {
        res.status(400).json({ error: "Invalid destination coordinates format." });
        return;
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
        res.json({ data: directions });
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
};
