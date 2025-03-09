import { FeatureCollection } from "@turf/helpers";
import { Request, Response } from "express";

import { SHOW_SPEED_CAMERA_THRESHOLD_IN_METERS } from "../constants/speed-camera-constants";
import { fetchSpeedCameras } from "../services/speed-cameras";
import { SpeedCameraProperties, SpeedCameraType } from "../types/SpeedCamera";
import { formatCameraFeature, isValidLonLat } from "../utils/map";

export const getSpeedCameras = async (req: Request, res: Response) => {
    const coordinatesParam = req.query.coordinates as string | undefined;

    if (!coordinatesParam) {
        return res.status(400).json({ error: "Coordinates are required." });
    }

    const coordinates = coordinatesParam.split(",").map(Number) as [number, number];

    if (coordinates.length !== 2 || !isValidLonLat(coordinates[0], coordinates[1])) {
        return res.status(400).json({ error: "Invalid coordinates format." });
    }

    try {
        const overpassFeatureCollection = await fetchSpeedCameras({
            userLonLat: { lon: coordinates[0], lat: coordinates[1] },
            distance: SHOW_SPEED_CAMERA_THRESHOLD_IN_METERS,
        });

        const overpassCameras = overpassFeatureCollection.features.map((feature) => {
            return formatCameraFeature({
                type: SpeedCameraType.Stationary,
                address: (feature.properties as unknown as SpeedCameraProperties).address,
                direction: (feature.properties as unknown as SpeedCameraProperties).direction,
                coordinates: {
                    lon: feature.geometry.coordinates[0] as number,
                    lat: feature.geometry.coordinates[1] as number,
                },
            });
        });

        const featureCollection = {
            type: "FeatureCollection",
            features: overpassCameras.map((camera) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [camera.geometry.coordinates[0], camera.geometry.coordinates[1]],
                },
                properties: {
                    type: camera.properties.type,
                    address: camera.properties.address,
                    direction: camera.properties.direction,
                },
            })),
        };

        res.json({ data: featureCollection as FeatureCollection });
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
};
