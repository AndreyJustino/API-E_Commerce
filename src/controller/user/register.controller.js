import { usuario } from "../../model/model.js";
import bcrypt from "bcrypt"

async function register(req, res) {
    try{
        const newUser = req.body;

        if(!newUser.name || !newUser.password || !newUser.email || !newUser.telefone ){
            res.status(400).json({message: "Preencha todos os campos!"});
        } else{
            
            const hash = await bcrypt.hash(newUser.password, 10)

            const [user, created] = await usuario.findOrCreate({
                where: {
                    email: newUser.email
                },
                defaults: {
                    name: newUser.name,
                    password: hash,
                    email: newUser.email,
                    telefone: newUser.telefone
                }
            })
    
            if(!created){
                res.status(409).json({message: "Email já cadastrado!"});
            } else{
                res.status(201).json({
                    message: "Usuario cadastrado com sucesso.",
                    user: user
                })
            }
        }

    }catch(error){
        res.status(500).json({
            message: "Erro ao cadastrar usuario",
            error: error.message
        })
    }
}

export default register