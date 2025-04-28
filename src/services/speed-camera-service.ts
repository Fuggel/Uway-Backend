import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";
import axios from "axios";

import { API_URL } from "../constants/api-constants";
import { DEFAULT_FC } from "../constants/map-constants";
import { BoundingBox, LonLat } from "../types/Geojson";
import { OverpassSpeedCamera } from "../types/SpeedCamera";
import { boundingBox, convertToGeoJson } from "../utils/geo-utils";

export async function fetchSpeedCameras(params: {
    userLonLat: LonLat;
    distance: number;
}): Promise<FeatureCollection<Geometry, GeometryCollection>> {
    try {
        if (!params.userLonLat.lon || !params.userLonLat.lat || !params.distance) {
            return DEFAULT_FC;
        }

        const { minLat, minLon, maxLat, maxLon } = boundingBox(params.userLonLat, params.distance) as BoundingBox;

        const overpassQuery = `
            [out:json];
            node["highway"="speed_camera"](${minLat},${minLon},${maxLat},${maxLon});
            out body;
        `;

        const url = `${API_URL.OPENSTREETMAP}?data=${encodeURIComponent(overpassQuery)}`;
        const response = await axios.get(url);

        return convertToGeoJson<OverpassSpeedCamera>({
            data: response.data.elements,
            getCoordinates: (element) => [element.lon, element.lat],
            getProperties: (element) => ({
                ...element.tags,
                name: "Blitzer",
                address: element.tags?.address,
            }),
        }) as FeatureCollection<Geometry, GeometryCollection>;
    } catch (error) {
        console.log(`Error fetching speed cameras: ${error}`);
        return DEFAULT_FC;
    }
}
