import request from 'supertest';
import dotenv from 'dotenv';

dotenv.config()

// função para testar se a aplicação ja esta rodando ou não
// se tiver me retorna um status 200 ou true, se não um false
async function testConnection(){
    let response;
    
    try{
        response = await request(`http://localhost:${process.env.PORT_API}`)
            .get("/helloWord")
    } catch{
        response = false
    }

    return response
}

export default testConnection