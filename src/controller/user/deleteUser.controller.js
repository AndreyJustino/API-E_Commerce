import { usuario } from "../../model/model.js";

async function deleteUser(req,res) {
    try{
        const user = req.body

        //verificando se todos os campos estão preenchidos
        if(!user.email || !user.password){
            res.status(400).json({
                message: "Preencha todos os campos."
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
                    message: "Usuário não encontrado."
                })
            } else{
                //verificando se senha fornecida é a mesma que esta no banco
                // se for igual, ai sim podera ser feito o delete
                if(userDB.password === user.password){
                    const userDelete = await usuario.destroy({
                        where: {
                            email: user.email
                        }
                    })

                    res.status(200).json({
                        message: "Usuário deletado com sucesso."
                    })
                } else{
                    res.status(401).json({
                        message: "Senha incorreta."
                    })
                }
            }
        }
    } catch(error){
        res.status(500).json({
            message: "Erro ao deletar usuario",
            erro: error
        })
    }
}

export default deleteUser