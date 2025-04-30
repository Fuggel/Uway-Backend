import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";

import { LonLat } from "../types/Geojson";
import { WarningType } from "../types/WarningManager";
import { fetchIncidents } from "./incident-service";
import { fetchSpeedCameras } from "./speed-camera-service";

export async function fetchEventData(params: {
    eventType: WarningType;
    userLonLat: LonLat;
    distance: number;
}): Promise<FeatureCollection<Geometry, GeometryCollection>> {
    switch (params.eventType) {
        case WarningType.SPEED_CAMERA:
            return await fetchSpeedCameras({
                userLonLat: params.userLonLat,
                distance: params.distance,
            });
        case WarningType.INCIDENT:
            return await fetchIncidents({
                userLonLat: params.userLonLat,
                distance: params.distance,
            });
        default:
            throw new Error("Unknown event type");
    }
}
