import creatId from "../../middleware/createId.js";
import { usuario } from "../../model/model.js";
import bcrypt from "bcrypt"

async function register(req, res) {
    try{
        const newUser = req.body;

        if(!newUser.name || !newUser.password || !newUser.email || !newUser.telefone ){
            res.status(400).json({message: "Preencha todos os campos!", status: 400});
        } else{
            
            const hash = await bcrypt.hash(newUser.password, 10)

            const [user, created] = await usuario.findOrCreate({
                where: {
                    email: newUser.email
                },
                defaults: {
                    id: creatId(),
                    name: newUser.name,
                    password: hash,
                    email: newUser.email,
                    telefone: newUser.telefone
                }
            })
    
            if(!created){
                res.status(409).json({message: "Email já cadastrado!", status: 409});
            } else{
                res.status(201).json({
                    message: "Usuario cadastrado com sucesso.",
                    user: user,
                    status: 201
                })
            }
        }

    }catch(error){
        res.status(500).json({
            message: "Erro ao cadastrar usuario",
            error: error.message,
            status: 500
        })
    }
}

export default register