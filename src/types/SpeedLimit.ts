export interface OverpassSpeedLimit {
    type: string;
    nodes: number[];
    id: number;
    lat: number;
    lon: number;
    tags: SpeedLimitProperties;
}

export interface SpeedLimitProperties {
    highway: string;
    lit: string;
    maxspeed: string;
    name: string;
    surface: string;
}

export interface SpeedLimitRequestParams {
    lon: number | undefined;
    lat: number | undefined;
    distance: number | undefined;
}
