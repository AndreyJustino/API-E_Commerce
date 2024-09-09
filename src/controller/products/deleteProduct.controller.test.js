import request from 'supertest';
import dotenv from 'dotenv';
import sequelize from '../../database/config.js';
import app from '../../app';
import testConnection from '../../middleware/testConnection.js';

dotenv.config()

describe("Testing return deleteProducts", () => {
    let token, response, server, code;
    beforeAll(async () => {
        await sequelize.sync().then(async () => {
            await sequelize.authenticate()

            response = await testConnection()

            if(!response || response.status != 200){
                server = app.listen(process.env.PORT_API)
            }

            await request(`http://localhost:${process.env.PORT_API}`)
                .post("/register")
                .send({
                    "name": "deleteProducts",
                    "password": "senha123",
                    "email": "deleteProducts@mail.com",
                    "telefone": "1140028922"
                })

                const responseLogin = await request(`http://localhost:${process.env.PORT_API}`)
                .post("/loginUser")
                .send({
                    "email": "deleteProducts@mail.com",
                    "password": "senha123"
                })
                token = responseLogin.body.token
            
            const responseProduct = await request(`http://localhost:${process.env.PORT_API}`)
            .post("/postProduct")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "nome": "Produto teste delete",
                "preco": 120,
                "imgNome": "Produto teste delete",
                "email": "deleteProducts@mail.com",
                "quantidade": 10
            })
            code = responseProduct.body.product.code
        })
    })

    afterAll(async () => {
        await request(`http://localhost:${process.env.PORT_API}`)
            .delete("/deleteUser")
            .send({
                "email": "deleteProducts@mail.com",
                "password": "senha123"
            })
            .set("Authorization", `Bearer ${token}`)

        if(!response || response.status != 200){
            await sequelize.close()
            await server.close()
        }   
        
    })

    test("Should returning status 400 and message if there's place null", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
        .delete("/deleteProducts")
        .set("Authorization", `Bearer ${token}`)
        .send({
            "code": code,
            "email": ""
        })
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Todos os campos são obrigatórios!")
    })

    test("Should returning status 404 and message if product or email not found", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
        .delete("/deleteProducts")
        .set("Authorization", `Bearer ${token}`)
        .send({
            "code": "codeQueNãoExiste",
            "email": "ouEmailQueNãoExiste"
        })
        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Produto ou E-mail não encontrado")
    })

    test("Should returning status 200 and message if sucess", async () => {
        
        const response = await request(`http://localhost:${process.env.PORT_API}`)
        .delete("/deleteProducts")
        .set("Authorization", `Bearer ${token}`)
        .send({
            "code": code,
            "email": "deleteProducts@mail.com"
        })
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Produto deletado com sucesso.")
    })
})