import { Router } from "express";

// importanto funções que vão ser usadas nas rotas
import register from "../controller/user/register.controller.js";
import update from "../controller/user/update.controller.js";
import deleteUser from "../controller/user/deleteUser.controller.js";
import getUser from "../controller/user/getUser.controller.js";
import loginUser from "../controller/user/postLoginUser.controller.js";
import verificaToken from "../middleware/verificarToken.js";

const routesUser = Router()

routesUser.get("/helloWord", (req, res) => {
    res.status(200).send("Hello World")
})

routesUser.get("/getUser/:email", verificaToken, getUser)
routesUser.post("/register", register)
routesUser.post("/loginUser", loginUser)
routesUser.put("/updateUser", verificaToken, update)
routesUser.delete("/deleteUser", verificaToken, deleteUser)

export default routesUser