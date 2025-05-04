import { SpeedCameraType } from "../types/SpeedCamera";

export function determineSpeedCameraType(type: SpeedCameraType | undefined) {
    switch (type) {
        case SpeedCameraType.FIXED:
            return "Fester Blitzer";
        case SpeedCameraType.MOBILE:
            return "Mobiler Blitzer";
        case SpeedCameraType.RED_LIGHT:
            return "Rotlicht Blitzer";
        default:
            return "Fester Blitzer";
    }
}
