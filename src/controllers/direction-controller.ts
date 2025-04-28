import { Request, Response } from "express";

import { fetchDirections } from "../services/direction-service";
import { DirectionRequestParams, DirectionResponse } from "../types/Direction";
import { isValidLonLat, simplifyGeometry, splitCoordinates } from "../utils/geo-utils";

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
        const directions = (await fetchDirections({
            profile,
            startLngLat: { lon: Number(startCoordinates[0]), lat: Number(startCoordinates[1]) },
            destinationLngLat: { lon: Number(destinationCoordinates[0]), lat: Number(destinationCoordinates[1]) },
            excludeTypes,
            waypoint: waypointCoordinates
                ? { lon: Number(waypointCoordinates[0]), lat: Number(waypointCoordinates[1]) }
                : undefined,
        })) as DirectionResponse;

        const optimizedDirections = directions.routes.map((route) => {
            return {
                geometry: simplifyGeometry(route.geometry),
                distance: route.distance,
                duration: route.duration,
                legs: route.legs.map((leg) => ({
                    summary: leg.summary,
                    distance: leg.distance,
                    duration: leg.duration,
                    steps: leg.steps.map((step) => ({
                        voiceInstructions: step.voiceInstructions,
                        bannerInstructions: step.bannerInstructions,
                        maneuver: step.maneuver,
                        distance: step.distance,
                        duration: step.duration,
                        geometry: simplifyGeometry(step.geometry),
                    })),
                })),
            };
        });

        res.json({ data: { routes: optimizedDirections } });
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
};
