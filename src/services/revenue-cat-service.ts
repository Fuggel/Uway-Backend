import axios from "axios";

import { AUTH } from "../constants/env-constants";
import { SubscriptionStatus } from "../types/RevenueCat";

export const checkSubscription = async (rcUserId: string): Promise<boolean> => {
    try {
        const response = await axios.get(`https://api.revenuecat.com/v1/subscribers/${rcUserId}`, {
            headers: {
                Authorization: `Bearer ${AUTH.RC_API_KEY}`,
            },
        });

        const subscriber = (response.data as SubscriptionStatus).subscriber;

        return Object.values(subscriber.subscriptions || {}).some((sub) => {
            const expires = sub?.expires_date;
            const refunded = sub?.refunded_at;

            return expires && new Date(expires) > new Date() && refunded === null;
        });
    } catch (err) {
        console.log(`Error checking subscription for user ${rcUserId}:`, err);
        return false;
    }
};
