import { Router } from "express";
import deleteProduct from "../controller/products/deleteProduct.controller.js";
import postProduct from "../controller/products/postProduct.controller.js";
import getProduct from "../controller/products/getProduct.controller.js";
import putProduct from "../controller/products/putProduct.controller.js";
import allProducts from "../controller/products/getAllProducts.controller.js";
import verificaToken from "../middleware/verificarToken.js";

const routesProducts = Router();

routesProducts.delete("/deleteProducts", verificaToken, deleteProduct)
routesProducts.post("/postProduct", verificaToken, postProduct)
routesProducts.get("/getProducts/:nome", getProduct);
routesProducts.put("/putProduct", verificaToken, putProduct)
routesProducts.get("/getAllProducts", allProducts)

export default routesProducts;
