import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";

import { LonLat } from "./Geojson";
import { IncidentType } from "./Incident";
import { SpeedCameraType } from "./SpeedCamera";

export interface WarningListener {
    eventType: WarningType | null;
    lon: number | null;
    lat: number | null;
    heading: number | null;
    speed: number | null;
    userId: string | null;
    eventWarningType: EventWarningType | null;
}

export enum WarningType {
    INCIDENT = "incident",
    SPEED_CAMERA = "speedCamera",
}

export interface Warning {
    warningType: WarningType | null;
    warningState: WarningState | null;
    eventWarningType: EventWarningType | null;
    textToSpeech: string | null;
    text: string | null;
}

export enum WarningState {
    EARLY = "early",
    LATE = "late",
}

export interface EventDataParams {
    eventType: WarningType;
    userLonLat: LonLat;
    distance: number;
}

export interface CalculateWarningsParams {
    eventType: WarningType;
    fc: FeatureCollection<Geometry, GeometryCollection>;
    userLonLat: LonLat;
    userHeading: number | undefined;
    userSpeed: number | undefined;
    eventWarningType: EventWarningType | null;
}

export interface DetermineWarningParams {
    type: WarningType;
    distance: number;
    eventWarningType: EventWarningType;
    userSpeed: number;
}

export type EventWarningType = IncidentType | SpeedCameraType;

export enum SocketEvent {
    WARNING = "warning",
    USER_LOCATION_UPDATE = "userLocationUpdate",
}
