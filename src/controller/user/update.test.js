import request from 'supertest';
import dotenv from 'dotenv';
import sequelize from '../../database/config.js';
import app from '../../app';
import testConnection from '../../middleware/testConnection.js';

dotenv.config()

describe("Testing return update", () => {
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
                    .send({
                        "name": "Admin",
                        "password": "senha123",
                        "email": "admin@mail.com",
                        "telefone": "1140028922"
                    })
                ;
                const responseLogin = await request(`http://localhost:${process.env.PORT_API}`)
                .post("/loginUser").send({
                    password: "senha123",
                    email: "admin@mail.com"
                })
                token = responseLogin.body.token
                
            } else{
                await request(`http://localhost:${process.env.PORT_API}`)
                    .post("/register")
                    .send({
                        "name": "Admin",
                        "password": "senha123",
                        "email": "admin@mail.com",
                        "telefone": "1140028922"
                    })
                ;
                const responseLogin = await request(`http://localhost:${process.env.PORT_API}`)
                .post("/loginUser").send({
                    password: "senha123",
                    email: "admin@mail.com"
                })
                token = responseLogin.body.token
            }
        })

    })

    afterAll(async () => {
        await request(`http://localhost:${process.env.PORT_API}`)
            .delete("/deleteUser")
            .send({
                "email": "admin@mail.com",
                "password": "senha12"
            })
            .set("Authorization", `Bearer ${token}`)

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
                "newPassword":"",
                "email": "user@mail.com",
                "telefone": "1140028922"
            })
            .set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(400)
        expect(response.body).toStrictEqual({
            "message": "Preencha todos os campos.",
            "status": 400
        })
    })

    test("Should return status 404 if user don't found", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .put("/updateUser")
            .send({
                "name": "User",
                "password": "123456",
                "newPassword":"1234",
                "email": "user@mail.com",
                "telefone": "1140028922"
            })
            .set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(404)
        expect(response.body).toStrictEqual({
            "message": "Usuario não encontrado.",
            "status": 404
        })
    })

    test("Shoudl return status 401 and message if password incorrect", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
        .put("/updateUser")
        .send({
            "name": "Admin",
            "password": "senha1234",
            "newPassword":"senha12",
            "email": "admin@mail.com",
            "telefone": "1140028922"
        })
        .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(401)
        expect(response.body).toStrictEqual({
            "message": "Senha incorreta.",
            "status": 401
        })
    })

    test("Should return status 200 if sucess", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .put("/updateUser")
            .send({
                "name": "Admin",
                "password": "senha123",
                "newPassword":"senha12",
                "email": "admin@mail.com",
                "telefone": "1140028922"
            })
            .set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("message")
        expect(response.body).toHaveProperty("user")
    })
})