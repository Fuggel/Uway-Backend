import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { AUTH } from "../constants/env-constants";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ") || !authHeader) {
        res.status(401).json({ message: "No token provided." });
        return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "No token provided." });
        return;
    }

    try {
        const decoded = jwt.verify(token, AUTH.JWT_SECRET_KEY);

        if (!decoded) {
            res.status(403).json({ message: "Invalid token." });
            return;
        }

        req.user = decoded as { id: string };
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid token." });
        return;
    }
};
