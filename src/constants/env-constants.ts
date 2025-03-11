export const API_KEY = {
    REVENUE_CAT_IOS: String(process.env._RC_IOS),
    REVENUE_CAT_ANDROID: String(process.env.RC_ANDROID),
    MAPBOX_ACCESS_TOKEN: String(process.env.MAPBOX_ACCESS_TOKEN),
    TOMTOM: String(process.env.TOMTOM_API_KEY),
    TANKERKOENIG: String(process.env.TANKERKOENIG_API_KEY),
};

export const THRESHOLD = {
    INCIDENT: {
        SHOW_IN_METERS: Number(process.env.SHOW_INCIDENT_THRESHOLD_IN_METERS),
    },

    SPEED_CAMERA: {
        SHOW_IN_METERS: Number(process.env.SHOW_SPEED_CAMERA_THRESHOLD_IN_METERS),
    },

    GAS_STATION: {
        SHOW_IN_KILOMETERS: Number(process.env.SHOW_GAS_STATION_THRESHOLD_IN_KILOMETERS),
    },
};
