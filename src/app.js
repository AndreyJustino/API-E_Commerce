import express from "express";
import routesUser from "./routes/user.routes.js";
import routesProducts from "./routes/products.routes.js";

const app = express();

app.use(express.json());

app.use(routesUser);
app.use(routesProducts)

export default app;
