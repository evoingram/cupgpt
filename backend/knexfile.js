require('dotenv').config({ path: '../.env' });

module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        },
        migrations: {
            directory: './migrations'
        },
        seeds: {
            directory: './seeds'
        }
    },
    test: {
        client: 'pg',
        connection: {
            host: process.env.TEST_DB_HOST,
            port: process.env.TEST_DB_PORT,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.TEST_DB_NAME
        }
    }
};
