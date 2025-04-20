import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { AUTH } from "../constants/env-constants";
import { checkSubscription } from "../services/revenue-cat";
import { AuthRequestParams } from "../types/Auth";

export const getToken = async (req: Request, res: Response) => {
    const { rcUserId } = req.query as Partial<AuthRequestParams>;

    if (!rcUserId) {
        res.status(400).json({ token: null, message: "Missing revenue cat user id" });
        return;
    }

    try {
        const isActive = await checkSubscription(rcUserId);

        if (!isActive) {
            res.status(403).json({ token: null, message: "Subscription not active." });
            return;
        }

        const token = jwt.sign({ id: rcUserId }, AUTH.JWT_SECRET_KEY, {
            expiresIn: AUTH.JWT_EXPIRATION_TIME_IN_SECONDS,
        });

        res.json({
            token,
            expiresIn: new Date(Date.now() + AUTH.JWT_EXPIRATION_TIME_IN_SECONDS * 1000).toISOString(),
        });
    } catch (error) {
        res.status(500).json({
            token: null,
            error: `Internal server error: ${error}`,
        });
    }
};
