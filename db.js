let dotenv = require('dotenv');
dotenv.config()

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        host: "localhost",
        dialect: "mysql"
    }
)

const tasks = require('./models/tasks');
const tasksModel = tasks(sequelize, Sequelize);


module.exports = {
    sequelize,
    tasksModel,
}