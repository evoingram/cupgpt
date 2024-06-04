const {Client} = require("pg");
require('dotenv').config({ path: '../.env' });

const dropTestDatabase = async () => {
    console.log('Running dropTestDatabase.')
    const client = new Client({
        host: process.env.TEST_DB_HOST,
        port: process.env.TEST_DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
    });

    console.log('Connecting to database.');
    await client.connect();
    console.log('dropping database.');
    await client.query(`DROP DATABASE IF EXISTS ${process.env.TEST_DB_NAME}`);
    console.log('ending connection to database.');
    await client.end();

    console.log(`Test database ${process.env.TEST_DB_NAME} dropped`);
};

module.exports = async () => {
    await dropTestDatabase();
};
