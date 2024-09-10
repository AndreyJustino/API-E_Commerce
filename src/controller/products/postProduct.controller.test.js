import request from "supertest"
import sequelize from "../../database/config.js"
import app from "../../app.js"
import dotenv from "dotenv"
import testConnection from "../../middleware/testConnection.js"

dotenv.config()

describe("Testing return postProduct", () => {
    let response, token, code, server;
    beforeAll(async () => {
        await sequelize.sync().then(async () => {
            await sequelize.authenticate()

            response = await testConnection()

            if(!response || response != 200){
                server = app.listen(process.env.PORT_API)
            }

            await request(`http://localhost:${process.env.PORT_API}`)
            .post("/register")
            .send({
                "name": "postProduct",
                "password": "senha123",
                "email": "postProduct@mail.com",
                "telefone": "1140028922"
            })

            const responseLogin = await request(`http://localhost:${process.env.PORT_API}`)
            .post("/loginUser")
            .send({
                "email": "postProduct@mail.com",
                "password": "senha123"
            })
            token = responseLogin.body.token
        })
        
    })

    afterAll(async () => {
        await request(`http://localhost:${process.env.PORT_API}`)
        .delete("/deleteProducts")
        .set("Authorization", `Bearer ${token}`)
        .send({
            "code": code,
            "email": "postProduct@mail.com"
        })
        
        await request(`http://localhost:${process.env.PORT_API}`)
        .delete("/deleteUser")
        .send({
            "email": "postProduct@mail.com",
            "password":"senha123"
        })
        .set("Authorization", `Bearer ${token}`)

        if(!response || response.status != 200){
            await sequelize.close()
            await server.close()
        } 
    })

    test("Should return 400 if there's place null", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
        .post("/postProduct")
        .send({
            "nome":"Produto teste postProduct",
            "preco": 100,
            "imgNome": "",
            "email":"postProduct@mail.com",
            "quantidade": 10
        })
        .set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Preencha todos os campos!"
        )
    })

    test("Should return 404 if email not found", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
        .post("/postProduct")
        .send({
            "nome":"Produto teste postProduct",
            "preco": 100,
            "imgNome": "produtoTestPostProduct",
            "email":"emailQueNaoExiste",
            "quantidade": 10
        })
        .set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Email não Cadastrado!")
    })

    test("Should return status 201 if product registered with sucess", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
        .post("/postProduct")
        .send({
            "nome":"Produto teste postProduct",
            "preco": 100,
            "imgNome": "produtoTestPostProduct",
            "email":"postProduct@mail.com",
            "quantidade": 10
        })
        .set("Authorization", `Bearer ${token}`)

        code = response.body.product.code

        expect(response.status).toBe(201)
        expect(response.body.message).toBe("Produto cadastrado com sucesso.")
        expect(response.body).toHaveProperty("product")

    })

    test("Should return status 409 if product already registered", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
        .post("/postProduct")
        .send({
            "nome":"Produto teste postProduct",
            "preco": 100,
            "imgNome": "produtoTestPostProduct",
            "email":"postProduct@mail.com",
            "quantidade": 10
        })
        .set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(409)
        expect(response.body.message).toBe("Produto já cadastrado!")

    })
})