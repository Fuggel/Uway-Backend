export enum SpeedCameraType {
    Stationary = "stationary",
    Mobile = "mobile",
}

export interface ISpeedCamera {
    deviceId: string;
    timestamp: Date;
    coordinates: [number, number];
    direction: number;
    type: SpeedCameraType;
    address: string;
}

export interface Overpass<T> {
    elements: {
        type: string;
        nodes: number[];
        id: number;
        lat: number;
        lon: number;
        tags: T;
    }[];
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
}
