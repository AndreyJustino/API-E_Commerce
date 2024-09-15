import { usuario } from "../../model/model.js";

async function getUser(req,res) {
    try{
        const email = req.params.email
        
        const user = await usuario.findOne({
            where: {
                email: email
            }
        })

        if(user){
            res.status(202).json({
                message: "Usuario encontrado",
                user: user,
                status: 202
            })
        } else{
            res.status(404).json({
                message: "Usuario não encontrado",
                status: 404
            })
        }
        
    } catch(error){
        res.status(500).json({
            message: "Erro ao obter o usuario.",
            erro: error.message,
            status: 500
        })
    }
}

export default getUser