import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";
import axios from "axios";

import { API_URL } from "../constants/api-constants";
import { API_KEY } from "../constants/env-constants";
import { DEFAULT_FC } from "../constants/map-constants";
import { BoundingBox, LonLat } from "../types/Geojson";
import { IncidentFeature } from "../types/Incident";
import { boundingBox } from "../utils/geo";

export async function fetchIncidents(params: {
    userLonLat: LonLat;
    distance: number;
}): Promise<FeatureCollection<Geometry, GeometryCollection>> {
    try {
        if (!params.userLonLat.lon || !params.userLonLat.lat || !params.distance) {
            return DEFAULT_FC;
        }

        const { minLat, minLon, maxLat, maxLon } = boundingBox(params.userLonLat, params.distance) as BoundingBox;

        const queryParams = new URLSearchParams();
        queryParams.append("bbox", `${minLon},${minLat},${maxLon},${maxLat}`);
        queryParams.append(
            "fields",
            "{incidents{type,geometry{type,coordinates},properties{iconCategory,probabilityOfOccurrence,from,to,length,delay,startTime,endTime,lastReportTime,events{description,iconCategory}}}}"
        );
        queryParams.append("language", "de-DE");
        queryParams.append("categoryFilter", "0,1,3,4,5,6,9,14");
        queryParams.append("timeValidityFilter", "present");
        queryParams.append("key", API_KEY.TOMTOM);

        const url = `${API_URL.TOMTOM_INCIDENTS}?${queryParams.toString()}`;
        const response = await axios.get(url);

        const features = response.data.incidents || [];

        return {
            type: "FeatureCollection",
            features: features.map((incident: IncidentFeature) => ({
                type: "Feature",
                geometry: incident.geometry,
                properties: {
                    ...incident.properties,
                    firstPoint: incident.geometry.coordinates[0],
                },
            })),
        };
    } catch (error) {
        console.log(`Error fetching incidents: ${error}`);
        return DEFAULT_FC;
    }
}
