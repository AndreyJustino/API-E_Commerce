import { usuario } from "../../model/model.js";
import {compare} from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

async function loginUser(req,res) {
    try{
        const user = await usuario.findOne({
            where: {
                email: req.body.email
            }
        })

        if(!user){
            return res.status(404).json({
                message: "Usuario não encontrado."
            })
        }

        const validarPassword = await compare(req.body.password, user.password)

        if(!validarPassword){
            return res.status(401).json({
                message: "Senha inválida."
            })
        }

        const token = jwt.sign({
            id: user.id,
            nome: user.name,
            email: user.email
        }, process.env.SECRET)

        res.status(200).json({
            message: "Login autorizado.",
            token: token
        })

    } catch(error){
        res.status(500).json({
            message: "Erro ao iniciar sessão",
            error: error.message
        })
    }
}

export default loginUser