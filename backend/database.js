const {Client} = require('pg');
require('dotenv').config();

const connectToDatabase = async () => {
    console.log("Connecting to db.")
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    await client.connect();
    console.log('done connecting to db.')
    return client;
};

const disconnectFromDatabase = async (client) => {
    console.log("Disconnecting from db.")
    await client.end();
};

module.exports = {connectToDatabase, disconnectFromDatabase};
