import request from 'supertest';
import dotenv from 'dotenv';
import sequelize from '../../database/config.js';
import app from '../../app';
import testConnection from '../../middleware/testConnection.js';
import bcrypt from "bcrypt"

dotenv.config()

const objUser = {
    name: "Admin",
    password: "senha123",
    email: "admin@mail.com",
    telefone: "1140028922"
}

describe("Testing response getUser", () => {
    let token;
    let server;
    let response;
    beforeAll(async () => {
        await sequelize.sync().then(async () => {
            //sincronizando e autenticando o banco, depois testando a conexão
            await sequelize.authenticate()

            response = await testConnection()

            // se não tiver, ele vai rodar a aplicação e registrar um usuario
            // para ser usado nos testes
            if(!response || response.statusCode != 200){
                server = app.listen(process.env.PORT_API)
        
                await request(`http://localhost:${process.env.PORT_API}`)
                    .post("/register")
                    .send(objUser)
                
                const response = await request(`http://localhost:${process.env.PORT_API}`)
                    .post("/loginUser").send({
                        password: "senha123",
                        email: "admin@mail.com"
                    })
                token = response.body.token
            } else{
                // se a aplicação ja tiver rodando, ele apenas vai criar o usuario
                await request(`http://localhost:${process.env.PORT_API}`)
                    .post("/register")
                    .send(objUser)
                
                const response = await request(`http://localhost:${process.env.PORT_API}`)
                    .post("/loginUser").send({
                        password: "senha123",
                        email: "admin@mail.com"
                    })
                token = response.body.token
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
    test("Should return status 202 and body if user found", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .get("/getUser/admin@mail.com")
            .set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(202)
        
        const body = response.body.user

        const validarPassword = await bcrypt.compare(objUser.password, body.password)

        function comparation(obj1, obj2, validacao){
            return obj1.name == obj2.name &&
                   obj1.email == obj2.email &&
                   obj1.telefone == obj2.telefone &&
                   validacao 
        }
        
        expect(comparation(body, objUser, validarPassword)).toBe(true)
    })

    test("Should return status 404 and body if user not found", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .get("/getUser/naoExiste")
            .set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(404)
        expect(response.body).toStrictEqual({
            "message": "Usuario não encontrado",
            "status": 404
        })
    })

})