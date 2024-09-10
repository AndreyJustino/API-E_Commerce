import request from "supertest"
import app from "../../app.js"
import dotenv from "dotenv"
import testConnection from "../../middleware/testConnection.js"
import sequelize from "../../database/config.js"

dotenv.config()

describe("Testing return postCart", () => {
    let token, response, code, server
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
                    "name": "postCart",
                    "password": "senha123",
                    "email": "postCart@mail.com",
                    "telefone": "1140028922"
                })
            
            const responseLogin = await request(`http://localhost:${process.env.PORT_API}`)
            .post("/loginUser")
            .send({
                "email": "postCart@mail.com",
                "password": "senha123"
            })
            token = responseLogin.body.token

            const responseCart = await request(`http://localhost:${process.env.PORT_API}`)
                .post("/postProduct")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    "nome": "camisa vermelha",
                    "preco": 100.00,
                    "imgNome":"camisaVermelha.png",
                    "email": "postCart@mail.com",
                    "quantidade": 10
                })
            code = responseCart.body.product.code
        })
    })

    afterAll(async () => {
        await request(`http://localhost:${process.env.PORT_API}`)
            .delete("/deleteCart")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "code": code
            })

        await request(`http://localhost:${process.env.PORT_API}`)
        .delete("/deleteProducts")
        .set("Authorization", `Bearer ${token}`)
        .send({
            "code": code,
            "email": "postCart@mail.com"
        })


        await request(`http://localhost:${process.env.PORT_API}`)
            .delete("/deleteUser")
            .send({
                "email": "postCart@mail.com",
                "password": "senha123"
            })
            .set("Authorization", `Bearer ${token}`)

        if(!response || response.status != 200){
            await sequelize.close()
            await server.close()
        } 
    })

    test("Should returning 400 if there's place null", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
        .post("/postCart")
        .set("Authorization", `Bearer ${token}`)
        .send({
            "code":"codigoFalso",
            "quantidade":"",
            "email":""
        })
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Preencha os campos!")
    })

    test("Should returning 404 if product not found in the cart", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .post("/postCart")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "code": "codigoFalso",
                "quantidade": 1,
                "email": "postCart@mail.com"
            })
        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Produto não encontrado")
    })

    test("Should returning 400 if larger quantity than is in stock", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
        .post("/postCart")
        .set("Authorization", `Bearer ${token}`)
        .send({
            "code": code,
            "quantidade": 1000,
            "email": "postCart@mail.com"
        })
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Quantidade acima do que esta em estoque")
    })

    test("Should returning 201 if product go to cart", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
        .post("/postCart")
        .set("Authorization", `Bearer ${token}`)
        .send({
            "code": code,
            "quantidade": 10,
            "email": "postCart@mail.com"
        })
        expect(response.status).toBe(201)
        expect(response.body.message).toBe("Produto adicionado ao carrinho com sucesso.")
    })

    test("Should returning 400 if product go to cart", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
        .post("/postCart")
        .set("Authorization", `Bearer ${token}`)
        .send({
            "code": code,
            "quantidade": 10,
            "email": "postCart@mail.com"
        })
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Produto já adicionado ao carrinho!")
    })    
})