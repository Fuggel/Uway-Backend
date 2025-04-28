import { IncidentType } from "../types/Incident";

export function determineIncidentType(type: IncidentType | undefined) {
    switch (type) {
        case IncidentType.Accident:
            return "Unfall";
        case IncidentType.DangerousConditions:
            return "Gefährliche Bedingungen";
        case IncidentType.Rain:
            return "Regen";
        case IncidentType.Ice:
            return "Eis";
        case IncidentType.Jam:
            return "Stau";
        case IncidentType.LaneClosed:
            return "Spur geschlossen";
        case IncidentType.RoadClosed:
            return "Straße geschlossen";
        case IncidentType.RoadWorks:
            return "Straßenarbeiten";
        case IncidentType.Wind:
            return "Wind";
        case IncidentType.BrokenDownVehicle:
            return "Fahrzeugpanne";
        default:
            return "Gefahr";
    }
}
