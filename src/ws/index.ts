import http from "http";
import { Server } from "socket.io";

import { THRESHOLD } from "../constants/env-constants";
import { WarningListener } from "../types/WarningManager";
import { calculateWarnings, fetchEventData, sendWarning } from "./warning-manager";

let io: Server | null = null;

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
            const { eventType, lon, lat, heading, speed, userId } = data;

            if (!eventType || !lon || !lat || !heading || !speed || !userId) {
                console.log(`At least one parameter is missing: ${JSON.stringify(data)}`);
                return;
            }

            try {
                const featureCollection = await fetchEventData({
                    eventType,
                    userLonLat: { lon, lat },
                    distance: THRESHOLD.SPEED_CAMERA.SHOW_IN_METERS,
                });

                const warning = calculateWarnings({
                    eventType,
                    fc: featureCollection,
                    userLonLat: { lon, lat },
                    userHeading: heading,
                    userSpeed: speed,
                });

                if (warning.warningType) {
                    sendWarning({ userId, warning });
                }
            } catch (error) {
                console.log(`Error fetching event data: ${error}`);
            }
        });

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

export { io };
