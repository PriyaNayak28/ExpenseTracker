const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
    },
    ispremiumuser: {
        type: Sequelize.BOOLEAN
    },
    totalExpenses: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }

})
module.exports = User;