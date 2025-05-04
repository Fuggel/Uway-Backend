import dotenv from "dotenv";

dotenv.config();

export const API_URL = {
    MAPBOX_DIRECTIONS: "https://api.mapbox.com/directions/v5/mapbox",
    MAPBOX_SEARCH_SUGGESTION: "https://api.mapbox.com/search/searchbox/v1/suggest",
    MAPBOX_REVERSE_GEOCODING: "https://api.mapbox.com/search/geocode/v6/reverse",
    MAPBOX_SEARCH_RETRIEVE: "https://api.mapbox.com/search/searchbox/v1/retrieve",
    OPENSTREETMAP: "https://overpass-api.de/api/interpreter",
    TANKERKOENIG: "https://creativecommons.tankerkoenig.de/json/list.php",
    TOMTOM_INCIDENTS: "https://api.tomtom.com/traffic/services/5/incidentDetails",
};
