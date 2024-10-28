import axios from "axios";

import { MAPBOX_ACCESS_TOKEN, MAPBOX_REVERSE_GEOCODING_API } from "../constants/api-constants";
import { LonLat, ReverseGeocodeProperties } from "../types/ICoordinates";
import { SpeedCameraType } from "../types/ISpeedCamera";

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

export async function reverseGeocode(lon: number, lat: number): Promise<ReverseGeocodeProperties> {
    if (!isValidLonLat(lon, lat)) {
        return { name: "Unbekannt", full_address: "Adresse nicht gefunden" };
    }

    const response = await axios.get(
        `${MAPBOX_REVERSE_GEOCODING_API}?longitude=${lon}&latitude=${lat}&limit=1&language=de&access_token=${MAPBOX_ACCESS_TOKEN}`
    );

    const fullAddress = response.data?.features[0]?.properties.full_address ?? "Adresse nicht gefunden";
    const name = response.data?.features[0]?.properties.name ?? "Unbekannt";

    return {
        name: name,
        full_address: fullAddress,
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
