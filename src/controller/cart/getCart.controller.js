import { cart } from "../../model/model.js";

async function getCart(req,res) {
    try{
        const emailComprador = req.params.emailComprador

        if(!emailComprador){
            return res.status(400).json({
                message: "Email do comprador não foi informado",
                status: 400
            })
        }

        const cartUsuario = await cart.findAll({
            where: {
                emailComprador: emailComprador
            }
        })

        if(!cartUsuario){
            return res.status(404).json({
                message: "Carrinho não encontrado",
                status: 404
            })
        }

        res.status(200).json({
            message: "Carrinho encontrado com sucesso",
            status: 200,
            cart: cartUsuario
        })

    }catch(error){
        return res.status(500).json({
            message: "Erro em get cart",
            error: error.message,
            status: 500
        })
    }
}

export default getCart