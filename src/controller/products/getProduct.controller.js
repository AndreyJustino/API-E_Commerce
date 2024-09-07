import { trataNome } from "../../middleware/trataNome.js";
import { produto } from "../../model/model.js";

async function getProduct(req,res) {
    try{
        const parametro = req.params
        
        const product = await produto.findOne({
            where: {nome: trataNome(parametro.nome)}
        })

        if(product){
            res.status(202).json({
                message: "Produto encontrado",
                product: product
            })
        } else{
            res.status(404).json({
                message: "Produto não encontrado"
            })
        }

    }catch(error){
        console.log(error.message)
        res.send(500).json({
            message: "Erro ao obter produto",
            erro: error.message
        })
    }
}

export default getProduct;