import { usuario } from "../../model/model.js";
import bcrypt from "bcrypt"

async function deleteUser(req,res) {
    try{
        const user = req.body

        //verificando se todos os campos estão preenchidos
        if(!user.email || !user.password){
            res.status(400).json({
                message: "Preencha todos os campos.",
                status: 400
            })
        } else{
            // buscando o usuario
            const userDB = await usuario.findOne({
                where: {
                    email: user.email,
                }
            })
            
            if(!userDB){
                res.status(404).json({
                    message: "Usuário não encontrado.",
                    status: 404
                })
            } else{
                //verificando se senha fornecida é a mesma que esta no banco
                // se for igual, ai sim podera ser feito o delete

                const validarPassword = await bcrypt.compare(user.password, userDB.password)

                if(validarPassword){
                    const userDelete = await usuario.destroy({
                        where: {
                            email: user.email
                        }
                    })

                    res.status(200).json({
                        message: "Usuário deletado com sucesso.",
                        status: 200
                    })
                } else{
                    res.status(401).json({
                        message: "Senha incorreta.",
                        status: 401
                    })
                }
            }
        }
    } catch(error){
        res.status(500).json({
            message: "Erro ao deletar usuario",
            erro: error.message,
            status: 500
        })
    }
}

export default deleteUser