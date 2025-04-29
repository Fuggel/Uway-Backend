import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";
import http from "http";
import { Server } from "socket.io";

import { INTERVAL, THRESHOLD } from "../constants/env-constants";
import { WarningListener } from "../types/WarningManager";
import { calculateWarnings, fetchEventData, sendWarning } from "./warning-manager";

let io: Server | null = null;
const eventDataCache = new Map<string, { data: FeatureCollection<Geometry, GeometryCollection>; timestamp: number }>();

export const initWebSocketServer = (httpServer: http.Server) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`New client connected: ${socket.id}`);

        socket.on("userLocationUpdate", async (data: WarningListener) => {
            const { eventType, lon, lat, heading, speed, userId, eventWarningType } = data;

            if (!userId) return;

            if (!eventType || !lon || !lat || !heading || !speed) {
                console.log(`At least one parameter is missing: ${JSON.stringify(data)}`);
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
                sendWarning(userId, warning);
            }
        });

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

export { io };
