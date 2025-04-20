import cors from "cors";
import express from "express";

import { authRoutes } from "./routes/auth-routes";
import { directionRoutes } from "./routes/direction-routes";
import { gasStationsRoutes } from "./routes/gas-station-routes";
import { incidentsRoutes } from "./routes/incident-routes";
import { searchRoutes } from "./routes/search-routes";
import { speedCameraRoutes } from "./routes/speed-camera-routes";

const app = express();
const PORT = process.env.PORT || 3001;

app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());

const router = express.Router();

router.use(authRoutes);
router.use(speedCameraRoutes);
router.use(searchRoutes);
router.use(incidentsRoutes);
router.use(gasStationsRoutes);
router.use(directionRoutes);

app.use("/api", router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
