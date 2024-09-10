import { cart } from "../../model/model.js";

async function deleteCart(req, res) {
    try{

    }catch(error){
        res.status(500).json({
            message: "Error delete cart",
            error: error.message
        })
    }
}

export default deleteCart