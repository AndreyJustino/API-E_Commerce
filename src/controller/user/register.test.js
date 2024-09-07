import request from 'supertest';
import dotenv from 'dotenv';
import sequelize from '../../database/config.js';
import app from '../../app';
import testConnection from '../../middleware/testConnection.js';

dotenv.config()

describe("Testing return register", () => {
    let server;
    let response;
    beforeAll(async () => {
        await sequelize.sync().then(async () => {
            //sincronizando e autenticando o banco, depois testando a conexão
            await sequelize.authenticate()

            response = await testConnection()

            if(!response || response.status != 200){
                server = app.listen(process.env.PORT_API)
            }
        })
    })

    afterAll(async () => {
        await request(`http://localhost:${process.env.PORT_API}`)
            .delete("/deleteUser")
            .send({
                "email": "register@mail.com",
                "password": "senha123"
            })
        
        if(!response || response.status != 200){
            await sequelize.close()
            await server.close()
        }

    })
    test("Should return 400 if there are empty fields", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .post("/register")
            .send({
                "name": "",
                "password": "senha123",
                "email": "register@mail.com",
                "telefone": "1140028922"
            })
        expect(response.status).toBe(400)
        expect(response.body).toStrictEqual({"message": "Preencha todos os campos!"})
    })

    test("Should return 201 if user register", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .post("/register")
            .send({
                "name": "register",
                "password": "senha123",
                "email": "register@mail.com",
                "telefone": "1140028922"
            })
        expect(response.status).toBe(201)
    })

    test("Should return 409 if email already exist", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .post("/register")
            .send({
                "name": "register",
                "password": "senha123",
                "email": "register@mail.com",
                "telefone": "1140028922"
            })
        expect(response.status).toBe(409)
        expect(response.body).toStrictEqual({"message": "Email já cadastrado!"})
        
    })

})
