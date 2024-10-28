export interface LonLat {
    lon: number | undefined;
    lat: number | undefined;
}

export interface BoundingBox {
    minLat: number;
    minLon: number;
    maxLat: number;
    maxLon: number;
}

export interface ReverseGeocodeProperties {
    full_address: string;
    name: string;
}
