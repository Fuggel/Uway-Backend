import { FeatureCollection } from "@turf/helpers";
import { simplify } from "@turf/turf";

import { LonLat } from "../types/Geojson";

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

    const metersPerDegree = 111111;
    const latDelta = distance / metersPerDegree;
    const lonDelta = distance / (metersPerDegree * Math.cos(lonLat.lat * (Math.PI / 180)));

    return {
        minLat: lonLat.lat - latDelta,
        minLon: lonLat.lon - lonDelta,
        maxLat: lonLat.lat + latDelta,
        maxLon: lonLat.lon + lonDelta,
    };
}

export function convertToGeoJson<T>(params: {
    data: T[];
    getProperties: (item: T) => Record<string, unknown>;
    getCoordinates: (item: T) => [number, number];
}): FeatureCollection {
    return {
        type: "FeatureCollection",
        features:
            params.data?.map((element) => ({
                type: "Feature",
                properties: params.getProperties(element),
                geometry: {
                    type: "Point",
                    coordinates: params.getCoordinates(element),
                },
            })) || [],
    };
}

export function splitCoordinates(coordinates: string) {
    return coordinates.split(",").map(Number) as [number, number];
}

export function simplifyGeometry(geometry: GeoJSON.LineString, tolerance = 0.00001, highQuality = true) {
    return simplify(geometry, {
        tolerance,
        highQuality,
    });
}

export function calculateAngleDifference(angle1: number, angle2: number) {
    const diff = Math.abs(angle1 - angle2);
    return diff > 180 ? 360 - diff : diff;
}
