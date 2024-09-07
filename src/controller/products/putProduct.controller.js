import { produto } from "../../model/model.js";

async function putProduct(req,res) {
    try{
        const product = req.body

        if(!product.nome || !product.preco || !product.imgNome || !product.code || !product.quantidade){
            return res.status(400).json({message: "Preencha todos os campos!"})
        }else{
            const findProduct = await produto.findOne({ 
                where: {
                    code: product.code
                }
            })

            if(!findProduct){
                res.status(404).json({message: "Produto não encontrado."})
            } else{
                await produto.update(
                    {
                        code: product.code,
                        nome: product.nome,
                        preco: product.preco,
                        imgNome: product.imgNome,
                        quantidade: product.quantidade
                    },
                    {
                        where: {
                            code: product.code
                        }
                    }
                )
                
                const userUpdate = await produto.findOne({
                    where: {
                        code: product.code
                    }
                })
    
                res.status(200).json({
                    message: "Operação bem sucedida.",
                    product: userUpdate
                })
            }
        }

    } catch(error){
        res.status(500).json({
            message: "Erro ao atualizar produto",
            error: error.message
        })
    }
}

export default putProduct;