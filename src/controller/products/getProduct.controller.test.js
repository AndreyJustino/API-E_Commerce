import sequelize from "../../database/config.js";
import request from "supertest"
import dotenv from "dotenv"
import app from "../../app.js";
import testConnection from "../../middleware/testConnection.js";

dotenv.config()

describe("Testing return getProduct", () => {
    let response, token, server, code;
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
                    "name": "getProduct",
                    "password": "senha123",
                    "email": "getProduct@mail.com",
                    "telefone": "1140028922"
                })

                const responseLogin = await request(`http://localhost:${process.env.PORT_API}`)
                .post("/loginUser")
                .send({
                    "email": "getProduct@mail.com",
                    "password": "senha123"
                })
                token = responseLogin.body.token
            
            const responseProduct = await request(`http://localhost:${process.env.PORT_API}`)
            .post("/postProduct")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "nome": "Produto teste getProduct",
                "preco": 120,
                "imgNome": "Produto teste getProduct",
                "email": "getProduct@mail.com",
                "quantidade": 10
            })
            code = responseProduct.body.product.code

        })
    })
    afterAll(async () => {
        await request(`http://localhost:${process.env.PORT_API}`)
        .delete("/deleteProducts")
        .set("Authorization", `Bearer ${token}`)
        .send({
            "code": code,
            "email": "getProduct@mail.com"
        })

        await request(`http://localhost:${process.env.PORT_API}`)
            .delete("/deleteUser")
            .send({
                "email": "getProduct@mail.com",
                "password": "senha123"
            })
            .set("Authorization", `Bearer ${token}`)

        if(!response || response.status != 200){
            await sequelize.close()
            await server.close()
        }   
        
    })
    
    test("Should return 404 if product not found", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
        .get(`/getProducts/nomeFalso`)
        .set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Produto não encontrado")
    })

    test("Should return 202 if product found", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
        .get(`/getProducts/Produto teste getProduct`)
        .set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(202)
        expect(response.body).toHaveProperty("product")
    })
})