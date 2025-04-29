import http from "http";
import { Server } from "socket.io";

import { WarningListener } from "../types/WarningManager";
import { sendWarning } from "./warning-manager";

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
            sendWarning(data, socket);
        });

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

export { io };
