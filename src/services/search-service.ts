import axios from "axios";

import { API_URL } from "../constants/api-constants";
import { API_KEY } from "../constants/env-constants";
import { LonLat } from "../types/Geojson";
import { SearchFeatureCollection, SearchSuggestion } from "../types/Search";

export async function fetchSearchSuggestion(params: {
    query: string;
    sessionToken: string;
    lngLat: LonLat;
}): Promise<SearchSuggestion> {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append("q", params.query);
        queryParams.append("session_token", params.sessionToken);
        queryParams.append("access_token", API_KEY.MAPBOX_ACCESS_TOKEN);
        queryParams.append("proximity", `${params.lngLat.lon},${params.lngLat.lat}`);
        queryParams.append("types", "address,street,place,poi,locality,city,district,postcode,country,category");
        queryParams.append("limit", "8");
        queryParams.append("language", "de");

        const url = `${API_URL.MAPBOX_SEARCH_SUGGESTION}?${queryParams.toString()}`;
        const response = await axios.get(url);

        return response.data;
    } catch (error) {
        console.log(`Error fetching search suggestions: ${error}`);
        return { suggestions: [] };
    }
}

export async function fetchSearchLocation(params: {
    mapboxId: string;
    sessionToken: string;
}): Promise<SearchFeatureCollection> {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append("access_token", API_KEY.MAPBOX_ACCESS_TOKEN);
        queryParams.append("session_token", params.sessionToken);
        queryParams.append("language", "de");

        const url = `${API_URL.MAPBOX_SEARCH_RETRIEVE}/${params.mapboxId}?${queryParams.toString()}`;
        const response = await axios.get(url);

        return response.data;
    } catch (error) {
        console.log(`Error fetching search results: ${error}`);
        return { type: "FeatureCollection", features: [] };
    }
}
