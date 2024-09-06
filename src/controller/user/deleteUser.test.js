import request from 'supertest';
import dotenv from 'dotenv';
import sequelize from '../../database/config.js';
import app from '../../app';
import testConnection from '../../middleware/testConnection.js';

dotenv.config()

describe("Testing response deleteUser", () => {
    let server;
    let response;
    beforeAll(async () => {
        // sincronizando o banco
        await sequelize.sync().then(async () => {
            try{
                // autenticando o banco e verificando se a aplicação esta rodando
                await sequelize.authenticate()

                response = await testConnection()

                // se não tiver, ele vai rodar a aplicação e registrar um usuario
                // para ser usado nos testes
                if(!response || response.statusCode != 200){
                    server = app.listen(process.env.PORT_API)
                
                    await request(`http://localhost:${process.env.PORT_API}`)
                        .post('/register')
                        .send({
                            "name": "delete",
                            "password": "delete123",
                            "email": "delete@email.com",
                        })
                } else{
                    // se a aplicação ja tiver rodando, ele apenas vai criar o usuario
                    await request(`http://localhost:${process.env.PORT_API}`)
                        .post('/register')
                        .send({
                            "name": "delete",
                            "password": "delete123",
                            "email": "delete@email.com",
                        })
                }
                
            }catch(error){
                console.error("Erro em teste deleteUser: ", error)
            }
        })
        
    })

    afterAll(async () => {
        // após o fim dos teste ele vai deletar o usuario criado no inicio
        await request(`http://localhost:${process.env.PORT_API}`)
            .delete("/deleteUser")
            .send({
                "email": "delete@email.com",
                "password": "delete123"
            })
        
        // fechando conexão se a aplicação tiver sido ligada por codigo
        if(!response || response.statusCode != 200){
            await sequelize.close()
            await server.close()
        }
            
    })
    test("Should return status 400 if there are empty fields", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .delete("/deleteUser")
            .send({
                "email": "",
                "password": "senha123"
            })
        expect(response.status).toBe(400)
        expect(response.body).toStrictEqual({"message": "Preencha todos os campos."})
    })

    test("Should return status 404 if user don't found", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .delete("/deleteUser")
            .send({
                "email": "email@email.com",
                "password": "senha123"
            })
        expect(response.status).toBe(404)
        expect(response.body).toStrictEqual({"message": "Usuário não encontrado."})
    })

    test("Should return status 401 if password is incorrect", async () => {
        
        
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .delete('/deleteUser')
            .send({
                "email": "delete@email.com",
                "password": "delete1234"
            })
        expect(response.status).toBe(401)
        expect(response.body).toStrictEqual({"message": "Senha incorreta."})
    })

    test("Should return status 200 if user delete", async () => {
        const response = await request(`http://localhost:${process.env.PORT_API}`)
            .delete("/deleteUser")
            .send({
                "email": "delete@email.com",
                "password": "delete123"
            })
            expect(response.status).toBe(200)
            expect(response.body).toStrictEqual({"message": "Usuário deletado com sucesso."})
    })
})
