import { produto, usuario } from "../../model/model.js";
import creatId from "../../middleware/createId.js";
import {trataNome} from "../../middleware/trataNome.js";

async function postProduct(req, res) {
  try {
    const product = req.body

    if(!product.nome || !product.preco || !product.imgNome || !product.email || !product.quantidade){
        return res.status(400).json({message: "Preencha todos os campos!"})
    }else{

        const user = await usuario.findOne({
            where: { email: product.email }
        })

        if(!user){
            return res.status(404).json({message: "Email não Cadastrado!"})
        }else{

            const newProduct = {
                code: creatId(),
                email: product.email,
                nome: trataNome(product.nome),
                preco: product.preco,
                quantidade: product.quantidade,
                imgNome: product.imgNome
            }

            const [productDB, created] = await produto.findOrCreate({
                where: {
                    email: product.email,
                    nome: trataNome(product.nome)
                },
                defaults: newProduct
            })
            if(!created){
                return res.status(409).json({message: "Produto já cadastrado!"})
            } else{
                res.status(201).json({
                    message: "Produto cadastrado com sucesso.",
                    product: productDB
                })
            }
        }

    }

  } catch (error) {
    
    res.status(500).json({
      message: "Erro ao criar produto",
      erro: error.message,
    });

  }
}

export default postProduct;