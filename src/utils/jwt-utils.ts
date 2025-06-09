import jwt from "jsonwebtoken";

import { AUTH } from "../constants/env-constants";

export function verifyToken(token: string) {
    try {
        const decoded = jwt.verify(token, AUTH.JWT_SECRET_KEY);
        return decoded as { id: string };
    } catch (err) {
        console.error("JWT verification failed:", err);
        return null;
    }
}
