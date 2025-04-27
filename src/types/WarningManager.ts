export interface WarningListener {
    eventType: WarningType | null;
    lon: number | null;
    lat: number | null;
    heading: number | null;
    speed: number | null;
    userId: string | null;
}

export enum WarningType {
    INCIDENT = "incident",
    SPEED_CAMERA = "speedCamera",
}

export interface Warning {
    warningType: WarningType | null;
    warningState: WarningState | null;
    distance: number | null;
    textToSpeech: string | null;
    text: string | null;
}

export enum WarningState {
    EARLY = "early",
    LATE = "late",
}
