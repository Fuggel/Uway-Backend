import dotenv from "dotenv";

dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI || "";
export const MAPBOX_REVERSE_GEOCODING_API = "https://api.mapbox.com/search/geocode/v6/reverse";
export const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
export const OPENSTREETMAP_API = "https://overpass-api.de/api/interpreter";
