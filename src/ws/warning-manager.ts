import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";
import { distance } from "@turf/turf";
import { Socket } from "socket.io";

import { INTERVAL, THRESHOLD } from "../constants/env-constants";
import { INITIAL_WARNING } from "../constants/warning-constants";
import { fetchIncidents } from "../services/incident-service";
import { fetchSpeedCameras } from "../services/speed-camera-service";
import { IncidentProperties } from "../types/Incident";
import { SpeedCameraProperties } from "../types/SpeedCamera";
import {
    CalculateWarningsParams,
    DetermineWarningParams,
    EventDataParams,
    EventWarningType,
    Warning,
    WarningListener,
    WarningState,
    WarningType,
} from "../types/WarningManager";
import { determineIncidentType } from "../utils/incident-utils";
import { determineSpeedCameraType } from "../utils/speed-camera-utils";
import { isFeatureAhead, warningThresholds } from "../utils/warning-manager-utils";
import { io } from "./index";

const eventDataCache = new Map<string, { data: FeatureCollection<Geometry, GeometryCollection>; timestamp: number }>();

export const sendWarning = async (data: WarningListener, socket: Socket) => {
    const { eventType, lon, lat, heading, speed, userId, eventWarningType } = data;

    if (!eventType || !lon || !lat || !heading || !speed || !userId) {
        console.log("At least one parameter is missing");
        return;
    }

    const cacheKey = `${socket.id}-${eventType}`;
    const now = Date.now();

    let cachedData = eventDataCache.get(cacheKey);

    if (!cachedData || now - cachedData.timestamp > INTERVAL.CACHE_REFRESH_INTERVAL_IN_MINUTES) {
        try {
            const featureCollection = await fetchEventData({
                eventType,
                userLonLat: { lon, lat },
                distance: THRESHOLD.SPEED_CAMERA.SHOW_IN_METERS,
            });

            cachedData = {
                data: featureCollection,
                timestamp: now,
            };

            eventDataCache.set(cacheKey, cachedData);
        } catch (error) {
            console.log(`Error fetching event data: ${error}`);
            return;
        }
    }

    const warning = calculateWarnings({
        eventType,
        fc: cachedData.data,
        userLonLat: { lon, lat },
        userHeading: heading,
        userSpeed: speed,
        eventWarningType,
    });

    if (warning.warningType) {
        if (!io) return;
        io.to(userId).emit("warning", warning);
    }
};

const calculateWarnings = (params: CalculateWarningsParams) => {
    const { eventType, fc, userLonLat, userHeading, userSpeed } = params;

    let closestWarning: Warning = INITIAL_WARNING;

    if (!userLonLat.lon || !userLonLat.lat || !userHeading || !userSpeed) {
        return INITIAL_WARNING;
    }

    const userPoint = [userLonLat.lon, userLonLat.lat];
    const { early, late } = warningThresholds(userSpeed);

    fc.features.forEach((feature) => {
        const eventPoint: [number, number] =
            eventType === WarningType.INCIDENT
                ? (feature.geometry.coordinates[0] as [number, number])
                : [feature.geometry.coordinates[0] as number, feature.geometry.coordinates[1] as number];

        const eventWarningType: EventWarningType =
            eventType === WarningType.INCIDENT
                ? (feature.properties as unknown as IncidentProperties).iconCategory
                : (feature.properties as unknown as SpeedCameraProperties).type;

        const distanceToFeature = distance(userPoint, eventPoint, { units: "meters" });

        const { isAhead } = isFeatureAhead({
            userPoint: [userLonLat.lon, userLonLat.lat] as [number, number],
            featurePoint: eventPoint,
            heading: userHeading,
            tolerance: THRESHOLD.NAVIGATION.IS_AHEAD_IN_DEGREES,
        });

        if (isAhead) {
            const warning = determineWarning({
                type: eventType,
                distance: distanceToFeature,
                eventWarningType,
            });

            if (distanceToFeature <= late) {
                closestWarning = {
                    ...warning,
                    warningState: WarningState.LATE,
                    eventWarningType,
                };
            } else if (distanceToFeature <= early) {
                closestWarning = {
                    ...warning,
                    warningState: WarningState.EARLY,
                    eventWarningType,
                };
            }
        }
    });

    return closestWarning.warningType ? closestWarning : INITIAL_WARNING;
};

const determineWarning = (params: DetermineWarningParams) => {
    switch (params.type) {
        case WarningType.SPEED_CAMERA:
            const speedCameraType = determineSpeedCameraType(params.eventWarningType as SpeedCameraProperties["type"]);

            return {
                warningType: WarningType.SPEED_CAMERA,
                distance: params.distance,
                textToSpeech: `${speedCameraType} in ${params.distance.toFixed(0)} Metern.`,
                text: `${speedCameraType} in ${params.distance.toFixed(0)} m.`,
            };
        case WarningType.INCIDENT:
            const incidentType = determineIncidentType(params.eventWarningType as IncidentProperties["iconCategory"]);

            return {
                warningType: WarningType.INCIDENT,
                distance: params.distance,
                textToSpeech: `${incidentType} in ${params.distance.toFixed(0)} Metern.`,
                text: `${incidentType} in ${params.distance.toFixed(0)} m.`,
            };
        default:
            return INITIAL_WARNING;
    }
};

const fetchEventData = async (params: EventDataParams): Promise<FeatureCollection<Geometry, GeometryCollection>> => {
    switch (params.eventType) {
        case WarningType.SPEED_CAMERA:
            return await fetchSpeedCameras({
                userLonLat: params.userLonLat,
                distance: params.distance,
            });
        case WarningType.INCIDENT:
            return await fetchIncidents({
                userLonLat: params.userLonLat,
                distance: params.distance,
            });
        default:
            throw new Error("Unknown event type");
    }
};
