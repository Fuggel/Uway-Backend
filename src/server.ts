import cors from "cors";
import express from "express";

import { ROUTES } from "./constants/route-constants";
import { initWebSocketServer } from "./ws";

const app = express();
const PORT = process.env.PORT || 3001;

app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());

const router = express.Router();

ROUTES.forEach((route) => router.use(route));

app.use("/api", router);

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

initWebSocketServer(server);
