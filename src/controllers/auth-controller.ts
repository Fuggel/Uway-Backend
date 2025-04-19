import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { AUTH } from "../constants/env-constants";
import { checkSubscription } from "../services/revenue-cat";
import { AuthRequestParams } from "../types/Auth";

export const getToken = async (req: Request, res: Response) => {
    const { rcUserId } = req.query as Partial<AuthRequestParams>;

    if (!rcUserId) {
        return res.status(400).json({ message: "Missing revenue cat user id" });
    }

    try {
        const isActive = await checkSubscription(rcUserId);

        if (!isActive) {
            return res.status(403).json({ message: "Subscription not active." });
        }

        const token = jwt.sign({ id: rcUserId }, AUTH.JWT_SECRET_KEY, { expiresIn: "1d" });

        // expiresIn has to match the token expiration time in the client
        return res.json({ token, expiresIn: 86400 });
    } catch (error) {
        return res.status(500).json({ error: `Internal server error: ${error}` });
    }
};
