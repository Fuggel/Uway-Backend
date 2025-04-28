import { authRoutes } from "../routes/auth-routes";
import { directionRoutes } from "../routes/direction-routes";
import { gasStationRoutes } from "../routes/gas-station-routes";
import { incidentRoutes } from "../routes/incident-routes";
import { searchRoutes } from "../routes/search-routes";
import { speedCameraRoutes } from "../routes/speed-camera-routes";
import { speedLimitRoutes } from "../routes/speed-limit-routes";

export const ROUTES = [
    authRoutes,
    speedCameraRoutes,
    speedLimitRoutes,
    searchRoutes,
    incidentRoutes,
    gasStationRoutes,
    directionRoutes,
];
