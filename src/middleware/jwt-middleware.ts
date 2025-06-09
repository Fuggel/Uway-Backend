import { NextFunction, Request, Response } from "express";
import { Socket } from "socket.io";

import { verifyToken } from "../utils/jwt-utils";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token provided." });
        return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        res.status(403).json({ message: "Invalid token." });
        return;
    }

    req.user = decoded;
    next();
};

export const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token || socket.handshake.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return next(new Error("Authentication error: Token not provided"));
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return next(new Error("Authentication error: Invalid token"));
    }

    socket.data.user = decoded;
    socket.join(decoded.id);
    next();
};
