import request from "supertest"
import dotenv from 'dotenv';
import sequelize from '../../database/config.js';
import app from '../../app';
import testConnection from '../../middleware/testConnection.js';

dotenv.config

const objUser = {
    name: "Admin",
    password: "senha123",
    email: "admin@mail.com",
    telefone: "1140028922"
}

describe("Testing return postLoginUser.test", () => {
    let token;
    let server;
    let response;

    beforeAll(async () => {
        await sequelize.sync().then(async () => {
            await sequelize.authenticate()

            response = await testConnection()

            if(!response || response.status != 200){
                server = app.listen(process.env.PORT_API)

                await request(`http://localhost:${process.env.PORT_API}`)
                .post("/register")
                .send(objUser)
            }else{
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
            .set("Authorization", `Bearer ${token}`)
        
        // fechando conexão se a aplicação tiver sido ligada por codigo
        if(!response || response.statusCode != 200){
            await sequelize.close()
            await server.close()
        }
    })
    test("Should return status 404 and message", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .post("/loginUser").send({
                password: "senha123",
                email: "falso@mail.com",
            })
        expect(response.status).toBe(404)
        expect(response.body).toStrictEqual({"message": "Usuario não encontrado."})
    })

    test("Should returning 401 and message", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .post("/loginUser").send({
                password: "senha12",
                email: "admin@mail.com",
            })
            expect(response.status).toBe(401)
            expect(response.body).toStrictEqual({"message": "Senha inválida."})
    })

    test("Should returning 200 and message", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .post("/loginUser").send({
                password: "senha123",
                email: "admin@mail.com",
            })
        token = response.body.token
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("message")
        expect(response.body).toHaveProperty("token")
    })
})