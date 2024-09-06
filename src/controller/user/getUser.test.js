import request from 'supertest';
import dotenv from 'dotenv';
import sequelize from '../../database/config.js';
import app from '../../app';
import testConnection from '../../middleware/testConnection.js';

dotenv.config()

const objUser = {
    name: "Admin",
    password: "senha123",
    email: "admin@mail.com"
}

describe("Testing response getUser", () => {
    let server;
    let response;
    beforeAll(async () => {
        await sequelize.sync().then(async () => {
            //sincronizando e autenticando o banco, depois testando a conexão
            await sequelize.authenticate()

            response = await testConnection()

            // se não tiver, ele vai rodar a aplicação e registrar um usuario
            // para ser usado nos testes
            if(!response || response.statusCode != 200){
                server = app.listen(process.env.PORT_API)
        
                await request(`http://localhost:${process.env.PORT_API}`)
                    .post("/register")
                    .send(objUser)
            } else{
                // se a aplicação ja tiver rodando, ele apenas vai criar o usuario
                await request(`http://localhost:${process.env.PORT_API}`)
                    .post("/register")
                    .send(objUser)
            }
        })
        
    })

    afterAll(async () => {
        // após o fim dos teste ele vai deletar o usuario criado no inicio
        await request(`http://localhost:${process.env.PORT_API}`)
            .delete("/deleteUser")
            .send({
                "email": "admin@mail.com",
                "password": "senha123"
            })
        
        // fechando conexão se a aplicação tiver sido ligada por codigo
        if(!response || response.statusCode != 200){
            await sequelize.close()
            await server.close()
        }
    })
    test("Should return status 202 and body if user found", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .get("/getUser/admin@mail.com")
        expect(response.status).toBe(202)
        
        const body = response.body.user

        function comparation(obj1, obj2){
            return obj1.name == obj2.name &&
                   obj1.email == obj2.email &&
                   obj1.password == obj2.password
        }
        
        expect(comparation(body, objUser)).toBe(true)
    })

    test("Should return status 404 and body if user not found", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .get("/getUser/naoExiste")
        expect(response.status).toBe(404)
        expect(response.body).toStrictEqual({
            "message": "Usuario não encontrado"
        })
    })

})