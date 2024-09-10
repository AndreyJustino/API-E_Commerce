import { Router } from "express";
import verificaToken from "../middleware/verificarToken.js";
import postCart from "../controller/cart/postCart.controller.js";
import deleteCart from "../controller/cart/deleteCart.controller.js";

const routerCart = Router()

routerCart.post("/postCart", verificaToken, postCart)
routerCart.delete("/deleteCart", verificaToken, deleteCart)

export default routerCart