import { point } from "@turf/helpers";
import { bearing } from "@turf/turf";

import { calculateAngleDifference } from "./geo-utils";

export function warningThresholds(speed: number) {
    switch (true) {
        case speed <= 30:
            return { early: 300, late: 150 };
        case speed <= 50:
            return { early: 500, late: 250 };
        case speed > 90:
            return { early: 1500, late: 800 };
        default:
            return { early: 800, late: 400 };
    }
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
