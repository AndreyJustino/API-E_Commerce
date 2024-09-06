import { usuario } from "../../model/model.js";

async function register(req, res) {
    try{
        const newUser = req.body;

        if(!newUser.name || !newUser.password || !newUser.email ){
            res.status(400).json({message: "Preencha todos os campos!"});
        } else{
            
            const [user, created] = await usuario.findOrCreate({
                where: {
                    email: newUser.email
                },
                defaults: newUser
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
            error: error
        })
    }
}

export default register