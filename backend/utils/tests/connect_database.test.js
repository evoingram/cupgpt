const { connectToDatabase, disconnectFromDatabase } = require('../connect_database');
const { Client } = require('pg');

jest.mock('pg', () => {
    const mClient = {
        connect: jest.fn(),
        end: jest.fn(),
    };
    return { Client: jest.fn(() => mClient) };
});

describe('connectToDatabase', () => {
    it('should connect to the database', async () => {
        const client = await connectToDatabase();
        expect(client.connect).toHaveBeenCalled();
    });

    it('should log connecting to the database', async () => {
        console.log = jest.fn();
        await connectToDatabase();
        expect(console.log).toHaveBeenCalledWith('Connecting to db.');
        expect(console.log).toHaveBeenCalledWith('done connecting to db.');
    });
});

describe('disconnectFromDatabase', () => {
    it('should disconnect from the database', async () => {
        const client = await connectToDatabase();
        await disconnectFromDatabase(client);
        expect(client.end).toHaveBeenCalled();
    });

    it('should log disconnecting from the database', async () => {
        console.log = jest.fn();
        const client = await connectToDatabase();
        await disconnectFromDatabase(client);
        expect(console.log).toHaveBeenCalledWith('Disconnecting from db.');
    });
});
