import { THRESHOLD } from "../constants/env-constants";
import { GasStation } from "../types/GasStation";

export function getStationIcon(stations: GasStation[], price: number) {
    const iconName = "gas-station";

    const totalPrice = stations.reduce((sum, station) => sum + station.diesel, 0);
    const avgPrice = totalPrice / stations.length;
    const diffPercentage = ((price - avgPrice) / avgPrice) * 100;

    if (diffPercentage >= THRESHOLD.GAS_STATION.PRICE_DIFFERENCE_THRESHOLD) {
        return `${iconName}-expensive`;
    } else if (diffPercentage <= -THRESHOLD.GAS_STATION.PRICE_DIFFERENCE_THRESHOLD) {
        return `${iconName}-cheap`;
    } else {
        return `${iconName}-average`;
    }
}
