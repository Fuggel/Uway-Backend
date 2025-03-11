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
