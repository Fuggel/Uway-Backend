import dotenv from "dotenv";

dotenv.config();

export const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN || "";
export const OPENSTREETMAP_API = "https://overpass-api.de/api/interpreter";
