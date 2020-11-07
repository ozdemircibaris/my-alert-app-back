module.exports = (sequelize, Sequelize) => {
    const tasksModel = sequelize.define('tasksModel', {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        subTitle: {
            type: Sequelize.STRING,
            allowNull: false
        },
        jobDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
    },
    {
        freezeTableName: true,
        timestamps: false
    })
    return tasksModel;
}