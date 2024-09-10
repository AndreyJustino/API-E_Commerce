import { cart } from "../../model/model.js";

async function postCart(req, res) {
    try{

    }catch(error){
        res.status(500).json({
            message: "Erro em postCart",
            error: error.message
        })
    }
}

export default postCart