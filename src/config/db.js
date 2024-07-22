const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'yame_store'
};

async function createConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Database connected successfully');
        return connection;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

module.exports = { createConnection };
