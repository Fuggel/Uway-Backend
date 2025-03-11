import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";
import axios from "axios";

import { API_URL } from "../constants/api-constants";
import { API_KEY } from "../constants/env-constants";
import { DEFAULT_FC } from "../constants/map-constants";
import { GasStation } from "../types/GasStation";
import { LonLat } from "../types/Geojson";
import { convertToGeoJson } from "../utils/geo";

export async function fetchGasStations(params: {
    userLonLat: LonLat;
    radius: number;
}): Promise<FeatureCollection<Geometry, GeometryCollection>> {
    try {
        if (!params.userLonLat.lon || !params.userLonLat.lat) {
            return DEFAULT_FC;
        }

        const queryParams = new URLSearchParams();
        queryParams.append("lat", params.userLonLat.lat.toString());
        queryParams.append("lng", params.userLonLat.lon.toString());
        queryParams.append("rad", params.radius.toString());
        queryParams.append("sort", "dist");
        queryParams.append("type", "all");
        queryParams.append("apikey", API_KEY.TANKERKOENIG);

        const url = `${API_URL.TANKERKOENIG}?${queryParams.toString()}`;

        const response = await axios.get(url);

        return convertToGeoJson<GasStation>({
            data: response.data.stations,
            getCoordinates: (station) => [station.lng, station.lat],
            getProperties: (station) => ({ ...station }),
        }) as FeatureCollection<Geometry, GeometryCollection>;
    } catch (error) {
        console.log(`Error fetching gas stations: ${error}`);
        return DEFAULT_FC;
    }
}
