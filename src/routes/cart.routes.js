import { Router } from "express";
import verificaToken from "../middleware/verificarToken.js";
import postCart from "../controller/cart/postCart.controller.js";
import deleteCart from "../controller/cart/deleteCart.controller.js";
import getCart from "../controller/cart/getCart.controller.js";

const routerCart = Router()

routerCart.get('/getCart/:emailComprador', verificaToken, getCart)
routerCart.post("/postCart", verificaToken, postCart)
routerCart.delete("/deleteCart", verificaToken, deleteCart)

export default routerCart