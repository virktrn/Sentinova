// config/db.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE || 'sentinova',
    process.env.MYSQL_USER || 'root',
    process.env.MYSQL_PASSWORD || 'Ta@190403',
    {
        host: process.env.MYSQL_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
    }
);

const initDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL connected via Sequelize');
        await sequelize.sync({ alter: true }); // auto-update schema
        console.log('Sequelize models synced');
    } catch (err) {
        console.error('Sequelize connection/sync error:', err);
    }
};

module.exports = { sequelize, initDb };
