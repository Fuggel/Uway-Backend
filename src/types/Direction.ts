export enum ExcludeType {
    TOLL = "toll",
    MOTORWAY = "motorway",
    FERRY = "ferry",
    UNPAVED = "unpaved",
    CASH_ONLY_TOLLS = "cash_only_tolls",
}

export type ExcludeTypes = {
    [key in ExcludeType]: boolean;
};

export interface DirectionRequestParams {
    profile: string | undefined;
    startCoordinates: string | undefined;
    destinationCoordinates: string | undefined;
    excludeTypes: ExcludeTypes | undefined;
    waypoint: string | undefined;
}

export interface DirectionResponse {
    routes: Route[];
}

export interface Route {
    geometry: GeoJSON.LineString;
    distance: number;
    duration: number;
    legs: Leg[];
    summary: string;
}

export interface Direction {
    geometry: GeoJSON.LineString;
    distance: number;
    duration: number;
    legs: Leg[];
}

export interface Leg {
    distance: number;
    duration: number;
    steps: Step[];
    summary: string;
}

export interface Step {
    bannerInstructions: BannerInstruction[];
    voiceInstructions: VoiceInstruction[];
    maneuver: Maneuver;
    geometry: GeoJSON.LineString;
    distance: number;
    duration: number;
}

export interface Maneuver {
    type: ManeuverType;
    instruction: string;
    location: number[];
    modifier: ModifierType;
}

export interface BannerInstruction {
    distanceAlongGeometry: number;
    primary: BannerProperties;
    secondary: BannerProperties;
    sub: BannerProperties;
}

export interface BannerProperties {
    text: string;
    type: ManeuverType;
    modifier: ModifierType;
    degrees: number;
    components: BannerComponent[];
}

export interface BannerComponent {
    text: string;
    type: string;
    abbr: string;
    abbr_priority: number;
    mapbox_shield: RoadShieldIcon;
    directions: LaneDirection[];
    active: boolean;
    active_direction: LaneDirection;
}

export enum RoadShieldName {
    DE_MOTORWAY = "de-motorway",
    MOTORWAY_EXIT = "motorwayExit",
    RECTANGLE_YELLOW = "rectangle-yellow",
}

export interface RoadShieldIcon {
    name: RoadShieldName | null;
    display_ref: string | null;
    text_color: string | null;
}

export enum LaneDirection {
    STRAIGHT = "straight",
    SHARP_LEFT = "sharp left",
    LEFT = "left",
    SLIGHT_LEFT = "slight left",
    SLIGHT_RIGHT = "slight right",
    RIGHT = "right",
    SHARP_RIGHT = "sharp right",
    U_TURN = "uturn",
}

export enum ManeuverType {
    TURN = "turn",
    DEPART = "depart",
    ARRIVE = "arrive",
    MERGE = "merge",
    ON_RAMP = "on ramp",
    OFF_RAMP = "off ramp",
    FORK = "fork",
    END_OF_ROAD = "end of road",
    CONTINUE = "continue",
    ROUNDABOUT = "roundabout",
}

export enum ModifierType {
    U_TURN = "uturn",
    SHARP_RIGHT = "sharp right",
    RIGHT = "right",
    SLIGHT_RIGHT = "slight right",
    STRAIGHT = "straight",
    SLIGHT_LEFT = "slight left",
    LEFT = "left",
    SHARP_LEFT = "sharp left",
}

export interface VoiceInstruction {
    distanceAlongGeometry: number;
    announcement: string;
    ssmlAnnouncement: string;
    type: "ssml";
}
