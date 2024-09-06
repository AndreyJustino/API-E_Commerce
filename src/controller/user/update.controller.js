import { usuario } from "../../model/model.js";

async function update(req, res){
    try{
        const user = req.body

        if(!user.name || !user.password || !user.email){
            res.status(400).json({
                message: "Preencha todos os campos."
            })
        }else{
            const findUser = await usuario.findOne({ 
                where: {
                    email: user.email
                }
            })

            if(!findUser){
                res.status(404).json({message: "Usuario não encontrado."})
            } else{
                await usuario.update(
                    {
                        name: user.name,
                        password: user.password,
                        email: user.email
                    },
                    {
                        where: {
                            email: user.email
                        }
                    }
                )
                
                const userUpdate = await usuario.findOne({
                    where: {
                        email: user.email
                    }
                })
    
                res.status(200).json({
                    message: "Operação bem sucedida.",
                    user: userUpdate
                })
            }
        }

    } catch(error){
        res.status(500).json({
            message: "Algum erro aconteceu",
            erro: error
        })
    }
}

export default update