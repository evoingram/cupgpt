const {Client} = require("pg");
require('dotenv').config({ path: '../.env' });

const createTestDatabase = async () => {
    console.log('Running createTestDatabase.');

    const client = new Client({
        host: process.env.TEST_DB_HOST,
        port: process.env.TEST_DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    });

    console.log('Connecting to database.');
    await client.connect();
    console.log(`creating database named ${process.env.TEST_DB_NAME}.`);
    const result = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.TEST_DB_NAME}'`);
    if (result.rowCount === 0) {
        await client.query(`CREATE DATABASE ${process.env.TEST_DB_NAME}`);
        console.log(`Database ${process.env.TEST_DB_NAME} created successfully`);
    } else {
        console.log(`Database ${process.env.TEST_DB_NAME} already exists`);
    }
    console.log('ending connection to database.');
    await client.end();

    console.log(`Test database ${process.env.TEST_DB_NAME} created`);
};

module.exports = async () => {
    await createTestDatabase();
};
