import { Sequelize } from 'sequelize';

// criando estancia do sequelize para se conectar com o banco no mysql
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./src/database/database.sqlite"
});

export default sequelize