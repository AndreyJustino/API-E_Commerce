import sequelize from "../../database/config.js";
import dotenv from "dotenv"
import app from "../../app.js";
import testConnection from "../../middleware/testConnection.js";
import request from "supertest"

dotenv.config()

describe("Testing return putProduct", () => {
    let response, token, code, server
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
                "name": "putProduct",
                "password": "senha123",
                "email": "putProduct@mail.com",
                "telefone": "1140028922"
            })

            const responseLogin = await request(`http://localhost:${process.env.PORT_API}`)
            .post("/loginUser")
            .send({
                "email": "putProduct@mail.com",
                "password": "senha123"
            })
            token = responseLogin.body.token

            const responseProduct = await request(`http://localhost:${process.env.PORT_API}`)
            .post("/postProduct")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "nome": "Produto teste put",
                "preco": 120,
                "imgNome": "Produto teste put",
                "email": "putProduct@mail.com",
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
            "email": "putProduct@mail.com"
        })

        await request(`http://localhost:${process.env.PORT_API}`)
            .delete("/deleteUser")
            .send({
                "email": "putProduct@mail.com",
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
        .put("/putProduct")
        .set("Authorization", `Bearer ${token}`)
        .send({
            "nome": "Produto teste putProduct",
            "preco": 120,
            "imgNome": "",
            "code": "",
            "quantidade": 10
        })
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Preencha todos os campos!")
    })

    test("Should return 404 if product not found", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
        .put("/putProduct")
        .set("Authorization", `Bearer ${token}`)
        .send({
            "nome": "Produto teste putProduct",
            "preco": 120,
            "imgNome": "produtoTestePutProduct",
            "code": "codigoFalsoAqui",
            "quantidade":10
        })

        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Produto não encontrado.")
    })

    test("Should return 200 if product update with sucess", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
        .put("/putProduct")
        .set("Authorization", `Bearer ${token}`)
        .send({
            "nome": "Produto teste putProduct",
            "preco": 120,
            "imgNome": "produtoTestePutProduct",
            "code": code,
            "quantidade": 10
        })
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Operação bem sucedida.")
        expect(response.body).toHaveProperty("product")
    })
})