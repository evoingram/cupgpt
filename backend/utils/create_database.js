const { Client } = require('pg');
const { exec } = require('child_process');
const knexConfig = require("../knexfile");
require('dotenv').config({ path: '../.env' });

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});

const runCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${command}`, error);
                return reject(error);
            }
            if (stderr) {
                console.error(`Standard error executing command: ${command}`, stderr);
            }
            console.log(`Command executed successfully: ${command}`, stdout);
            resolve(stdout);
        });
    });
};

const setupDatabase = async (dbName = process.env.DB_NAME) => {
    try {
        await client.connect();
        console.log('Connected to the database', dbName);

        const result = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
        console.log('result', JSON.stringify(result));
        if (result === undefined) {
            await client.query(`CREATE DATABASE ${dbName}`);
            console.log(`Database ${dbName} created successfully`);
        } else {
            console.log(`Database ${dbName} already exists`);
        }

        await client.end();
        console.log('Disconnected from the database');

        console.log('Running migrations...');
        await runCommand('npx knex migrate:latest');
        console.log('Migrations completed successfully');

        console.log('Seeding the database...');
        await runCommand('npx knex seed:run');
        console.log('Database seeded successfully');

        console.log('Database setup completed successfully');

        console.log('Starting the backend...');
        await runCommand('npm start');

    } catch (err) {
        console.error('Error setting up database:', err);
        if (client) {
            await client.end();
        }
    }
};

const generateKnexClient = (typedKnexConfig) => {
    const knexConfig = require('../knexfile');
    const newTypedKnexConfig = (typedKnexConfig === 'development') ? knexConfig.development : knexConfig.test;
    return require('knex')(newTypedKnexConfig);
}

setupDatabase().then(r => console.log('database setup complete.'));

module.exports = { runCommand, generateKnexClient, setupDatabase };
