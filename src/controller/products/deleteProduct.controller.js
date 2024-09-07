import { produto } from "../../model/model.js";

async function deleteProduct(req, res) {
  try {
    const {code, email } = req.body;

    if (!code || !email) {
      return res.status(400).json({
        message: "Todos os campos são obrigatórios!",
      });
    } else {
      const productDB = await produto.findOne({
        where: {
          email: email,
          code: code
        },
      });

      if (!productDB) {

        return res.status(404).json({
          message: "Produto ou E-mail não encontrado",
        });

      } else {
          const productDelete = await produto.destroy({
            where: {
              code: code,
            },
          });

          res.status(200).json({
            message: "Produto deletado com sucesso.",
          });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Erro ao deletar usuario",
      erro: error,
    });
  }
}

export default deleteProduct