import { point } from "@turf/helpers";
import { bearing } from "@turf/turf";

import { calculateAngleDifference } from "./geo-utils";

export function warningThresholds(speed: number) {
    if (speed <= 30) return { early: 300, late: 150 };
    if (speed <= 50) return { early: 500, late: 250 };
    if (speed > 90) return { early: 1500, late: 800 };
    return { early: 800, late: 400 };
}

export function getRoundingThreshold(speed: number) {
    if (speed <= 30) return 10;
    if (speed <= 50) return 20;
    if (speed <= 80) return 50;
    return 100;
}

export function isFeatureAhead(params: {
    userPoint: [number, number];
    featurePoint: [number, number];
    heading: number;
    tolerance: number;
}) {
    const { tolerance, userPoint, featurePoint, heading } = params;

    const userPointGeo = point(userPoint);
    const featurePointGeo = point(featurePoint);

    const bearingToFeature = bearing(userPointGeo, featurePointGeo);
    const angleDifference = calculateAngleDifference(heading, bearingToFeature);

    const isAhead = angleDifference <= tolerance;

    return { isAhead };
}
