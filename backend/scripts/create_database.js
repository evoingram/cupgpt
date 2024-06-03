const {Client} = require('pg');
const {exec} = require('child_process');
require('dotenv').config();

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

const setupDatabase = async () => {
    try {
        await client.connect();
        console.log('Connected to the database');

        const result = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`);
        if (result.rowCount === 0) {
            await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log(`Database ${process.env.DB_NAME} created successfully`);
        } else {
            console.log(`Database ${process.env.DB_NAME} already exists`);
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

setupDatabase();
