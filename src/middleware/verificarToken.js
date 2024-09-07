import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

function verificaToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({
            message: 'Token não autorizado.'
        });
    }
    
    try{
        jwt.verify(token, process.env.SECRET)
        next()
        
    }catch(error){
        res.status(500).json({
            message: "Token não valido",
        })
    }
}

export default verificaToken