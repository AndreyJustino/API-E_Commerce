import request from "supertest"
import dotenv from "dotenv"
import testConnection from "../../middleware/testConnection.js"
import sequelize from "../../database/config.js"
import app from "../../app.js"

describe("Testing return deleteCart", () => {
    let response, token, code, server;
    let responsepostCART;
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
                    "name": "deleteCart",
                    "password": "senha123",
                    "email": "deleteCart@mail.com",
                    "telefone": "1140028922"
                })
            
            const responseLogin = await request(`http://localhost:${process.env.PORT_API}`)
            .post("/loginUser")
            .send({
                "email": "deleteCart@mail.com",
                "password": "senha123"
            })
            token = responseLogin.body.token

            const responseCart = await request(`http://localhost:${process.env.PORT_API}`)
                .post("/postProduct")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    "nome": "camisa verde",
                    "preco": 100.00,
                    "imgNome":"camisaVerde.png",
                    "email": "deleteCart@mail.com",
                    "quantidade": 10
                })
            code = responseCart.body.product.code

            responsepostCART = await request(`http://localhost:${process.env.PORT_API}`)
                .post("/postCart")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    "code": code,
                    "quantidade": 10,
                    "email": "deleteCart@mail.com"
                })
            
        })
    })

    afterAll(async () => {
        await request(`http://localhost:${process.env.PORT_API}`)
            .delete("/deleteProducts")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "code": code,
                "email": "deleteCart@mail.com"
            })

        await request(`http://localhost:${process.env.PORT_API}`)
            .delete("/deleteUser")
            .send({
                "email": "deleteCart@mail.com",
                "password": "senha123"
            })
            .set("Authorization", `Bearer ${token}`)

        if(!response || response.status != 200){
            await sequelize.close()
            await server.close()
        } 
    })

    test("Should return 400 if there's place null", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
        .delete("/deleteCart")
        .set("Authorization", `Bearer ${token}`)
        .send({
            "code": "",
        })
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Preencha todos os campos")
    })

    test("Should return 404 if product not found", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
        .delete("/deleteCart")
        .set("Authorization", `Bearer ${token}`)
        .send({
            "code": "codeFake",
        })
        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Produto não encontrado no cart")
    })

    test("Should return 200 if product removed cart", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
        .delete("/deleteCart")
        .set("Authorization", `Bearer ${token}`)
        .send({
            "code": code,
        })
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Produto deletado com sucesso.")
    })
})