const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Expense = sequelize.define('expenses', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    expense: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    desc: {
        type: Sequelize.STRING,
        allowNull: false
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false

    }
});
module.exports = Expense;

