import { Feature, FeatureCollection } from "@turf/helpers";
import { Request, Response } from "express";

import {
    SHOW_SPEED_CAMERA_THRESHOLD_IN_METERS,
    SPEED_CAMERA_REPORT_COOLDOWN,
} from "../constants/speed-camera-constants";
import { SpeedCamera } from "../models/speed-camera";
import { fetchSpeedCameras } from "../services/speed-cameras";
import { ISpeedCamera, SpeedCameraProperties, SpeedCameraType } from "../types/ISpeedCamera";
import { formatCameraFeature, isValidLonLat, reverseGeocode } from "../utils/map";

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

        const savedCameras = (await SpeedCamera.find()).map((camera) => {
            return formatCameraFeature({
                type: camera.type,
                address: camera.address,
                direction: String(camera.direction),
                coordinates: { lon: camera.coordinates[0], lat: camera.coordinates[1] },
            });
        });

        const allCameras = [...overpassCameras, ...savedCameras];

        const featureCollection = {
            type: "FeatureCollection",
            features: allCameras.map((camera) => ({
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

export const reportSpeedCamera = async (req: Request, res: Response) => {
    const { deviceId, coordinates, direction, type } = req.body as ISpeedCamera;

    if (!isValidLonLat(coordinates[0], coordinates[1])) {
        return res.status(400).json({ error: "Invalid coordinates." });
    }

    if (direction < 0 || direction >= 360) {
        return res.status(400).json({ error: "Direction must be between 0 and 359." });
    }

    if (!Object.values(SpeedCameraType).includes(type)) {
        return res.status(400).json({ error: "Invalid speed camera type." });
    }

    try {
        const lastReport = await SpeedCamera.findOne({
            deviceId: deviceId,
            timestamp: { $gte: new Date(Date.now() - SPEED_CAMERA_REPORT_COOLDOWN) },
        });

        if (lastReport) {
            return res.status(403).json({ error: "You can only report a speed camera every 30 minutes." });
        }

        const { full_address } = await reverseGeocode(coordinates[0], coordinates[1]);

        const newSpeedCamera = new SpeedCamera({
            deviceId,
            timestamp: new Date(),
            coordinates,
            direction,
            type,
            address: full_address,
        });

        await newSpeedCamera.save();

        const featureCollection = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [newSpeedCamera.coordinates[0], newSpeedCamera.coordinates[1]],
            },
            properties: {
                type: newSpeedCamera.type,
                address: newSpeedCamera.address,
                direction: newSpeedCamera.direction,
            },
        };

        res.json({ data: featureCollection as Feature });
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
};
