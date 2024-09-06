import express from "express";
import routesUser from "./routes/user.routes.js";

const app = express();

app.use(express.json());

app.use(routesUser);

export default app;
