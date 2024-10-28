import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";

export const DEFAULT_FC: FeatureCollection<Geometry, GeometryCollection> = { type: "FeatureCollection", features: [] };
