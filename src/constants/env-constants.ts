import dotenv from "dotenv";

dotenv.config();

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

export const INTERVAL = {
    RATE_LIMITER_IN_MINUTES: Number(process.env.RATE_LIMITER_INTERVAL_IN_MINUTES),
};

export const RATE_LIMITER = {
    INCIDENT: Number(process.env.RATE_LIMITER_INCIDENT),
    SPEED_CAMERA: Number(process.env.RATE_LIMITER_SPEED_CAMERA),
    GAS_STATION: Number(process.env.RATE_LIMITER_GAS_STATION),
    SEARCH: Number(process.env.RATE_LIMITER_SEARCH),
    DIRECTION: Number(process.env.RATE_LIMITER_DIRECTIONS),
};

export const AUTH = {
    JWT_SECRET_KEY: String(process.env.JWT_SECRET_KEY),
    JWT_EXPIRATION_TIME_IN_SECONDS: Number(process.env.JWT_EXPIRATION_TIME_IN_SECONDS),
    RC_API_KEY: String(process.env.RC_API_KEY),
};
