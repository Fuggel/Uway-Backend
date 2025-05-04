import axios from "axios";
import { API_URL } from "../constants/api-constants";
import { API_KEY } from "../constants/env-constants";
import { ReverseGeocodeProperties } from "../types/Geojson";
import { isValidLonLat } from "../utils/geo-utils";

export async function reverseGeocode(lon: number, lat: number): Promise<ReverseGeocodeProperties> {
    if (!isValidLonLat(lon, lat)) {
        return { address: "Adresse nicht gefunden" };
    }

    const response = await axios.get(
        `${API_URL.MAPBOX_REVERSE_GEOCODING}?longitude=${lon}&latitude=${lat}&limit=1&language=de&access_token=${API_KEY.MAPBOX_ACCESS_TOKEN}`
    );

    const address = response.data?.features[0]?.properties.name_preferred ?? "Adresse nicht gefunden";

    return { address };
}