import express from "express";
import routesUser from "./routes/user.routes.js";
import routesProducts from "./routes/products.routes.js";
import routerCart from "./routes/cart.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(routesUser);
app.use(routesProducts);
app.use(routerCart);

export default app;
