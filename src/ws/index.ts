import http from "http";
import { Server } from "socket.io";

import { SocketEvent, WarningListener } from "../types/WarningManager";
import { eventDataCache, sendWarning, warningTimeouts } from "./warning-manager";

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

        socket.on(SocketEvent.USER_LOCATION_UPDATE, async (data: WarningListener) => {
            sendWarning(data, socket);
        });

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);

            for (const key of eventDataCache.keys()) {
                if (key.startsWith(socket.id)) {
                    eventDataCache.delete(key);
                }
            }

            for (const [userId, timeout] of warningTimeouts.entries()) {
                if (userId.startsWith(socket.id)) {
                    clearTimeout(timeout);
                    warningTimeouts.delete(userId);
                }
            }
        });
    });

    return io;
};

export { io };
