const Sequelize = require('sequelize');
const sequelize = new Sequelize("my-alert-app", "root", "Ass122...", {
    host: "localhost",
    dialect: "mysql"
})

const tasks = require('./models/tasks');
const tasksModel = tasks(sequelize, Sequelize);


module.exports = {
    sequelize,
    tasksModel,
}