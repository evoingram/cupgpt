const { handleSearchQuery, generateRawOutput } = require('../search_service');
const { connectToDatabase, disconnectFromDatabase } = require('../connect_database');

jest.mock('../connect_database', () => ({
    connectToDatabase: jest.fn(),
    disconnectFromDatabase: jest.fn(),
}));

jest.mock('pg', () => {
    const mClient = {
        query: jest.fn(),
    };
    return { Client: jest.fn(() => mClient) };
});

describe('handleSearchQuery', () => {
    let client;

    beforeEach(() => {
        client = {
            query: jest.fn().mockResolvedValue({ rows: [] }),
        };
        connectToDatabase.mockResolvedValue(client);
    });

    it('should handle search query', async () => {
        const query = 'test query';
        const options = { bulletedList: true };

        const result = await handleSearchQuery(query, options);

        expect(connectToDatabase).toHaveBeenCalled();
        expect(client.query).toHaveBeenCalled();
        expect(disconnectFromDatabase).toHaveBeenCalled();
        expect(result.results).toEqual([]);
        expect(result.rawOutput).toContain('Query: test query');
    });

    it('should log the received query and options', async () => {
        console.log = jest.fn();
        const query = 'test query';
        const options = { bulletedList: true };

        await handleSearchQuery(query, options);

        expect(console.log).toHaveBeenCalledWith('Starting to handle search query: test query.');
        expect(console.log).toHaveBeenCalledWith('Received options:', options);
    });
});

describe('generateRawOutput', () => {
    it('should generate raw output with options', () => {
        const results = [{ topic: 'Test Topic', content: [{ description: 'Test Content', examples: [] }] }];
        const query = 'test query';
        const options = { bulletedList: true, accuracy: true, includeSources: true, myWritingStyle: true, searchInternet: true, bestPractices: true };

        const output = generateRawOutput(results, query, options);

        expect(output).toContain('Query: test query');
        expect(output).toContain('Test Topic');
        expect(output).toContain('Test Content');
        expect(output).toContain('Please give this to me in a detailed bulleted list format.');
        expect(output).toContain('Please be as accurate as possible and do not make anything up.');
        expect(output).toContain('Please include the sources you used to provide this information.');
        expect(output).toContain('Please write this in my writing style as much as possible.');
        expect(output).toContain('Please search the internet for the most up-to-date information as possible on this inquiry.');
    });

    it('should log the received options', () => {
        console.log = jest.fn();
        const results = [{ topic: 'Test Topic', content: [{ description: 'Test Content', examples: [] }] }];
        const query = 'test query';
        const options = { bulletedList: true };

        generateRawOutput(results, query, options);

        expect(console.log).toHaveBeenCalledWith('Generating raw output');
        expect(console.log).toHaveBeenCalledWith('Options received:', options);
    });
});
