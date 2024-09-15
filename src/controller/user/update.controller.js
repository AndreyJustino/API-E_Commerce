import { usuario } from "../../model/model.js";
import { hash, compare } from "bcrypt";

async function update(req, res){
    try{
        const user = req.body

        if(!user.name || !user.newPassword || !user.password || !user.email || !user.telefone){
            res.status(400).json({
                message: "Preencha todos os campos.",
                status: 400
            })
        }else{
            const findUser = await usuario.findOne({ 
                where: {
                    email: user.email
                }
            })

            if(!findUser){
                res.status(404).json({message: "Usuario não encontrado.", status: 404})
            } else{

                const validarPassword = await compare(user.password, findUser.password)

                if(!validarPassword){
                    res.status(401).json({message: "Senha incorreta.", status: 401})
                } else{
                    
                    await usuario.update(
                        {
                            id: findUser.id,
                            name: user.name,
                            password: await hash(user.newPassword, 10),
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
                        user: userUpdate,
                        status: 200
                    })
                }

                
            }
        }

    } catch(error){
        res.status(500).json({
            message: "Algum erro aconteceu",
            erro: error.message,
            status: 500
        })
    }
}

export default update