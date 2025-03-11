import cors from "cors";
import express from "express";

import { directionRoute } from "./routes/direction-routes";
import { gasStationsRoute } from "./routes/gas-station-routes";
import { incidentsRoute } from "./routes/incident-routes";
import { searchLocationsRoute, searchSuggestionsRoute } from "./routes/search-routes";
import { speedCameraRoutes } from "./routes/speed-camera-routes";

const app = express();
const PORT = process.env.PORT || 3001;

app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());

const router = express.Router();

router.use(speedCameraRoutes);
router.use(searchSuggestionsRoute);
router.use(searchLocationsRoute);
router.use(incidentsRoute);
router.use(gasStationsRoute);
router.use(directionRoute);

app.use("/api", router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
