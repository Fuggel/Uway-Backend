import cors from "cors";
import express from "express";

import { getSpeedCamerasRoute } from "./routes/speed-camera-routes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api", getSpeedCamerasRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
