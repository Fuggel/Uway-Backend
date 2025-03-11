import { Geometry } from "@turf/helpers";

export interface SearchSuggestion {
    suggestions: SearchSuggestionProperties[];
}

export interface SearchSuggestionProperties {
    default_id: string;
    mapbox_id: string;
    name: string;
    full_address: string;
    place_formatted: string;
    distance: number;
    maki: string;
    feature_type: string;
    coordinates: {
        longitude: number;
        latitude: number;
    };
}

export interface SearchFeatureCollection {
    type: string;
    features: SearchFeature[];
}

export interface SearchFeature {
    type: string;
    geometry: Geometry;
    properties: SearchSuggestionProperties;
}

export interface SearchSuggestionRequestParams {
    query: string | undefined;
    sessionToken: string | undefined;
    coordinates: string | undefined;
}

export interface SearchLocationRequestParams {
    mapboxId: string | undefined;
    sessionToken: string | undefined;
}
