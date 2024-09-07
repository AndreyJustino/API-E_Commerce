import request from 'supertest';
import dotenv from 'dotenv';
import sequelize from '../../database/config.js';
import app from '../../app';
import testConnection from '../../middleware/testConnection.js';

dotenv.config()

describe("Testing return update", () => {
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
                    .send({
                        "name": "Admin",
                        "password": "senha123",
                        "email": "admin@mail.com",
                        "telefone": "1140028922"
                    })
            } else{
                await request(`http://localhost:${process.env.PORT_API}`)
                    .post("/register")
                    .send({
                        "name": "Admin",
                        "password": "senha123",
                        "email": "admin@mail.com",
                        "telefone": "1140028922"
                    })
            }
        })

    })

    afterAll(async () => {
        await request(`http://localhost:${process.env.PORT_API}`)
            .delete("/deleteUser")
            .send({
                "email": "admin@mail.com",
                "password": "senha123"
            })

        if(!response || response.status != 200){
            await sequelize.close()
            await server.close()
        }   
        
    })
    test('Should return status 400 if there are empty fields', async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .put("/updateUser")
            .send({
                "name": "User",
                "password": "",
                "email": "user@mail.com",
                "telefone": "1140028922"
            })
        expect(response.status).toBe(400)
        expect(response.body).toStrictEqual({"message": "Preencha todos os campos."})
    })

    test("Should return status 404 if user don't found", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .put("/updateUser")
            .send({
                "name": "User",
                "password": "123456",
                "email": "user@mail.com",
                "telefone": "1140028922"
            })
        expect(response.status).toBe(404)
        expect(response.body).toStrictEqual({"message": "Usuario não encontrado."})
    })

    test("Should return status 200 if sucess", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .put("/updateUser")
            .send({
                "name": "Admin1",
                "password": "senha123",
                "email": "admin@mail.com",
                "telefone": "1140028922"
            })
        expect(response.status).toBe(200)
    })
})