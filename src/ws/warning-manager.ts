import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";
import { distance } from "@turf/turf";

import { THRESHOLD } from "../constants/env-constants";
import { INITIAL_WARNING } from "../constants/warning-constants";
import { fetchIncidents } from "../services/incident-service";
import { fetchSpeedCameras } from "../services/speed-camera-service";
import { LonLat } from "../types/Geojson";
import { Warning, WarningState, WarningType } from "../types/WarningManager";
import { isFeatureAhead, warningThresholds } from "../utils/warning-manager-utils";
import { io } from "./index";

export const fetchEventData = async (params: {
    eventType: WarningType;
    userLonLat: LonLat;
    distance: number;
}): Promise<FeatureCollection<Geometry, GeometryCollection>> => {
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

export const sendWarning = (params: { userId: string | undefined; warning: Warning }) => {
    if (!io || !params.userId) {
        console.log("Socket.io server not initialized.");
        return;
    }

    io.to(params.userId).emit("warning", params.warning);
};

export const calculateWarnings = (params: {
    eventType: WarningType;
    fc: FeatureCollection<Geometry, GeometryCollection>;
    userLonLat: LonLat;
    userHeading: number | undefined;
    userSpeed: number | undefined;
}) => {
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

        const distanceToFeature = distance(userPoint, eventPoint, { units: "meters" });

        const { isAhead } = isFeatureAhead({
            userPoint: [userLonLat.lon, userLonLat.lat] as [number, number],
            featurePoint: eventPoint,
            heading: userHeading,
            tolerance: THRESHOLD.NAVIGATION.IS_AHEAD_IN_DEGREES,
        });

        if (isAhead) {
            const warning = determineWarning(eventType, distanceToFeature);

            if (distanceToFeature <= late) {
                closestWarning = {
                    ...warning,
                    warningState: WarningState.LATE,
                };
            } else if (distanceToFeature <= early) {
                closestWarning = {
                    ...warning,
                    warningState: WarningState.EARLY,
                };
            }
        }
    });

    return closestWarning.warningType ? closestWarning : INITIAL_WARNING;
};

const determineWarning = (type: WarningType, distance: number) => {
    switch (type) {
        case WarningType.SPEED_CAMERA:
            return {
                warningType: WarningType.SPEED_CAMERA,
                distance: distance,
                textToSpeech: `Blitzer in ${distance.toFixed(0)} Metern.`,
                text: `Blitzer in ${distance.toFixed(0)} m.`,
            };
        case WarningType.INCIDENT:
            return {
                warningType: WarningType.INCIDENT,
                distance: distance,
                textToSpeech: `Gefahr in ${distance.toFixed(0)} Metern.`,
                text: `Gefahr in ${distance.toFixed(0)} m.`,
            };
        default:
            return INITIAL_WARNING;
    }
};
