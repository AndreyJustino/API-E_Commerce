import { cart, produto } from "../../model/model.js";

async function postCart(req, res) {
    try{
        const {code, quantidade} = req.body

        if(!code, !quantidade){
            return res.status(400).json({message: "Preencha os campos!"})
        }
        
        const verificaCode = await produto.findOne({
            where: {
                code: code
            }
        })
        
        if(!verificaCode){
            return res.status(404).json({
                message: "Produto não encontrado"
            })
        }

        if(quantidade > verificaCode.quantidade){
            return res.status(400).json({
                message: "Quantidade acima do que esta em estoque"
            })
        }

        const newCart = {
            code: code,
            nome: verificaCode.nome,
            preco: verificaCode.preco,
            imgNome: verificaCode.imgNome,
            quantidade: quantidade
        }

        const [cartDB, created] = await cart.findOrCreate({
            where: {
                code: code
            },
            defaults: newCart
        })

        if(!created){
            return res.status(400).json({message: "Produto já adicionado ao carrinho!"})
        }

        res.status(201).json({
            message: "Produto adicionado ao carrinho com sucesso.",
            carrinho: cartDB
        })

        
    }catch(error){
        res.status(500).json({
            message: "Erro em postCart",
            error: error.message
        })
    }
}

export default postCart