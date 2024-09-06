import { Router } from "express";

// importanto funções que vão ser usadas nas rotas
import register from "../controller/user/register.controller.js";
import update from "../controller/user/update.controller.js";
import deleteUser from "../controller/user/deleteUser.controller.js";
import getUser from "../controller/user/getUser.controller.js";

const routesUser = Router()

routesUser.get("/helloWord", (req, res) => {
    res.status(200).send("Hello World")
})

routesUser.get("/getUser/:email", getUser)
routesUser.post("/register", register)
routesUser.put("/updateUser", update)
routesUser.delete("/deleteUser", deleteUser)

export default routesUser