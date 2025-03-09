import { LonLat } from "../types/Geojson";
import { SpeedCameraType } from "../types/SpeedCamera";

export function isValidLonLat(lon: number | undefined, lat: number | undefined) {
    if (lon === undefined || lat === undefined) {
        return false;
    }
    return lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;
}

export function boundingBox(lonLat: LonLat, distance: number) {
    if (!lonLat.lon || !lonLat.lat) {
        return;
    }

    const metersPerDegree = 111111; // Roughly 111 km at the equator
    const latDelta = distance / metersPerDegree;
    const lonDelta = distance / (metersPerDegree * Math.cos(lonLat.lat * (Math.PI / 180)));

    return {
        minLat: lonLat.lat - latDelta,
        minLon: lonLat.lon - lonDelta,
        maxLat: lonLat.lat + latDelta,
        maxLon: lonLat.lon + lonDelta,
    };
}

export function formatCameraFeature(params: {
    type: SpeedCameraType;
    address: string | undefined;
    direction: string | undefined;
    coordinates: LonLat;
}) {
    return {
        type: "Feature",
        properties: {
            type: params.type,
            address: params.address || "Unbekannt",
            direction: params.direction,
        },
        geometry: {
            type: "Point",
            coordinates: [params.coordinates.lon, params.coordinates.lat],
        },
    };
}
