import axios from "axios";

const REVENUECAT_API_KEY = process.env.REVENUECAT_API_KEY;

export const checkSubscription = async (rcUserId: string) => {
    const response = await axios.get(`https://api.revenuecat.com/v1/subscribers/${rcUserId}`, {
        headers: {
            Authorization: `Bearer ${REVENUECAT_API_KEY}`,
        },
    });

    const data = response.data.subscriber;

    const isActive = Object.values(data.entitlements || {}).some(
        (ent: any) => ent?.expires_date && new Date(ent.expires_date) > new Date()
    );

    return isActive;
};
