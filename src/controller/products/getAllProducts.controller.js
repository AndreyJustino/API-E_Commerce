import { produto } from "../../model/model.js";

async function allProducts(req, res) {
    try{
        const allProducts = await produto.findAll()

        res.status(200).json({
            message: "Lista de produtos",
            data: allProducts
        })
    } catch(error){
        res.status(500).json({
            message: "Erro ao buscar produtos",
            error: error.message
        })
    }
}

export default allProducts