import { cart } from "../../model/model.js";

async function deleteCart(req, res) {
    try{
        const {code} = req.body

        if(!code){
            return res.status(400).json({message: "Preencha todos os campos"})
        }

        const verificaCode = await cart.findOne({
            where: {code: code}
        })

        if(!verificaCode){
            return res.status(404).json({message: "Produto não encontrado no cart"})
        }

        const productDelete = await cart.destroy({
            where: {
              code: code,
            },
          });

        res.status(200).json({
            message: "Produto deletado com sucesso.",
        });

    }catch(error){
        res.status(500).json({
            message: "Error delete cart",
            error: error.message
        })
    }
}

export default deleteCart