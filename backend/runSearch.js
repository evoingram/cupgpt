const { handleSearchQuery, generateRawOutput } = require('./search');
const { connectToDatabase, disconnectFromDatabase } = require('./database');

const query = process.argv[2];
const options = JSON.parse(process.argv[3]);

const runSearch = async () => {
    const client = await connectToDatabase();
    const query = "bubble sort";
    const options = {"bulletedList":true,"accuracy":true,"includeSources":true,"myWritingStyle":true,"searchTheInternet":true}

    try {
        const result = await handleSearchQuery(query, options);
        const rawOutput = generateRawOutput(result.results, query, options);
        console.log(rawOutput);
    } catch (error) {
        console.error(error);
    } finally {
        await disconnectFromDatabase(client);
    }
};

runSearch();
