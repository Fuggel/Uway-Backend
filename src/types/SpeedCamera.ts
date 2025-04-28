export interface OverpassSpeedCamera {
    type: string;
    nodes: number[];
    id: number;
    lat: number;
    lon: number;
    tags: SpeedCameraProperties;
}

export interface SpeedCameraProperties {
    direction: string;
    highway: string;
    man_made: string;
    mapillary: string;
    maxspeed: string;
    height: string;
    colour: string;
    name: string;
    address: string;
    geometry: {
        type: string;
        coordinates: number[];
    };
    type?: SpeedCameraType;
}

export enum SpeedCameraType {
    FIXED = 0,
    MOBILE = 1,
    RED_LIGHT = 2,
}
