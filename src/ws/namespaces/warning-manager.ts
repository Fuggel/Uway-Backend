import { distance } from "@turf/turf";
import { Socket } from "socket.io";

import { io } from "..";
import { INTERVAL, THRESHOLD } from "../../constants/env-constants";
import { INITIAL_WARNING } from "../../constants/warning-constants";
import { fetchEventData } from "../../services/warning-manager-service";
import { IncidentProperties } from "../../types/Incident";
import { SpeedCameraProperties } from "../../types/SpeedCamera";
import {
    CalculateWarningsParams,
    DetermineWarningParams,
    EventDataCache,
    EventWarningType,
    Warning,
    WarningListener,
    WarningState,
    WarningType,
} from "../../types/WarningManager";
import { SocketEvent } from "../../types/Ws";
import { determineIncidentType } from "../../utils/incident-utils";
import { determineSpeedCameraType } from "../../utils/speed-camera-utils";
import { getRoundingThreshold, isFeatureAhead, warningThresholds } from "../../utils/warning-manager-utils";

export const eventDataCache = new Map<string, EventDataCache>();
export const warningTimeouts = new Map<string, NodeJS.Timeout>();

export const registerWarningHandlers = (socket: Socket) => {
    socket.on(SocketEvent.USER_LOCATION, (data: WarningListener) => {
        sendWarning(data, socket);
    });
};

const sendWarning = async (data: WarningListener, socket: Socket) => {
    const { eventType, lon, lat, heading, speed, eventWarningType } = data;
    const userId = socket.data?.user?.id;

    if (!eventType || !lon || !lat || !heading || !speed || !userId) {
        return;
    }

    const cacheKey = `${socket.id}-${eventType}`;
    const now = Date.now();

    let cachedData = eventDataCache.get(cacheKey);

    if (!cachedData || now - cachedData.timestamp > INTERVAL.CACHE_REFRESH_INTERVAL_IN_MINUTES) {
        eventDataCache.delete(cacheKey);

        try {
            const featureCollection = await fetchEventData({
                eventType,
                userLonLat: { lon, lat },
                distance:
                    eventType === WarningType.SPEED_CAMERA
                        ? THRESHOLD.SPEED_CAMERA.SHOW_IN_METERS
                        : THRESHOLD.INCIDENT.SHOW_IN_METERS,
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
        io.to(userId).emit(SocketEvent.WARNING_MANAGER, warning);

        if (warningTimeouts.has(userId)) {
            clearTimeout(warningTimeouts.get(userId));
        }

        const timeout = setTimeout(() => {
            if (!io) return;
            io.to(userId).emit(SocketEvent.WARNING_MANAGER, INITIAL_WARNING);
            warningTimeouts.delete(userId);
        }, INTERVAL.CLEAR_WARNING_EVENTS_INTERVAL_IN_SECONDS);

        warningTimeouts.set(userId, timeout);
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

        if (distanceToFeature > early) return;

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
                userSpeed,
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

    return closestWarning;
};

const determineWarning = (params: DetermineWarningParams) => {
    const { type, distance, eventWarningType, userSpeed } = params;

    const rounding = getRoundingThreshold(userSpeed);
    const roundedDistance = Math.round(distance / rounding) * rounding;

    switch (type) {
        case WarningType.SPEED_CAMERA:
            const speedCameraType = determineSpeedCameraType(eventWarningType as SpeedCameraProperties["type"]);

            return {
                warningType: WarningType.SPEED_CAMERA,
                distance: roundedDistance,
                textToSpeech: `${speedCameraType} in ${roundedDistance} Metern.`,
                text: `${speedCameraType} in ${roundedDistance} m.`,
            };
        case WarningType.INCIDENT:
            const incidentType = determineIncidentType(eventWarningType as IncidentProperties["iconCategory"]);
            return {
                warningType: WarningType.INCIDENT,
                distance: roundedDistance,
                textToSpeech: `${incidentType} in ${roundedDistance} Metern.`,
                text: `${incidentType} in ${roundedDistance} m.`,
            };
        default:
            return INITIAL_WARNING;
    }
};
