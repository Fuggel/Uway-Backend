import { Feature, FeatureCollection, Geometry, GeometryCollection, LineString } from "@turf/helpers";
import axios from "axios";

import { API_URL } from "../constants/api-constants";
import { DEFAULT_FC } from "../constants/map-constants";
import { BoundingBox, LonLat } from "../types/Geojson";
import { OverpassSpeedLimit } from "../types/SpeedLimit";
import { boundingBox } from "../utils/geo";

export async function fetchSpeedLimits(params: {
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
            way
                ["highway"]
                ["maxspeed"]
                (${minLat},${minLon},${maxLat},${maxLon});
            out body;
            >;
            out skel qt;
        `;

        const url = `${API_URL.OPENSTREETMAP}?data=${encodeURIComponent(overpassQuery)}`;
        const response = await axios.get(url);

        return convertToGeoJSON(response.data) as FeatureCollection<Geometry, GeometryCollection>;
    } catch (error) {
        console.log(`Error fetching speed limits: ${error}`);
        return DEFAULT_FC;
    }
}

function convertToGeoJSON(data: { elements: OverpassSpeedLimit[] }) {
    const features = data.elements
        .filter((element) => element.type === "way")
        .map((way) => {
            const coordinates = way.nodes?.map((nodeId) => {
                const node = data.elements?.find((e) => e.type === "node" && e.id === nodeId);
                return [node?.lon, node?.lat];
            });
            return {
                type: "Feature",
                properties: {
                    maxspeed: way.tags.maxspeed,
                },
                geometry: {
                    type: "LineString",
                    coordinates: coordinates,
                },
            };
        });

    return {
        type: "FeatureCollection",
        features: features as Feature<LineString>[],
    };
}
