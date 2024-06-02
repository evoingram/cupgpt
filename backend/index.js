require('dotenv').config();
const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);
const cors = require('cors');
const { Client } = require('pg');
const topicsRouter = require('./API/topics/topicsRouter');
const contentsRouter = require('./API/contents/contentsRouter');
const examplesRouter = require('./API/examples/examplesRouter');

const app = express();
app.use(express.json());

app.use(cors({ origin: 'http://localhost:3001' }));

// Root route for basic check
app.get('/', (req, res) => {
    res.send('Welcome to CupGPT: A Coding Monkey Wizard');
});

// Test route to check database connection
app.get('/test-db', async (req, res) => {
    try {
        const result = await db.raw('SELECT 1+1 AS result');
        res.json(result.rows);
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.use('/topics', topicsRouter);

app.use('/content', contentsRouter);

app.use('/examples', examplesRouter);

app.get('/verify-seed', async (req, res) => {
    try {
        const topics = await db('topics').select('*');
        const content = await db('content').select('*');
        const examples = await db('examples').select('*');
        res.json({ topics, content, examples });
    } catch (error) {
        console.error('Error verifying seed data:', error);
        res.status(500).json({ error: 'Failed to verify seed data' });
    }
});

app.post('/query', async (req, res) => {
    const { query, options } = req.body;
    console.log('First /query endpoint called');

    try {
        console.log('Received query:', query);
        const { results, originalQuery } = await handleSearchQuery(query);
        console.log('Search results:', results);
        const rawOutput = generateRawOutput(results, originalQuery, options.bulletedList);

        res.status(200).json({ results, rawOutput });
    } catch (error) {
        console.error('Error in /query endpoint:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

const handleSearchQuery = async (query) => {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    await client.connect();

    // Preserve the original query
    const originalQuery = query;

    // List of common stop words to exclude
    const stopWords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves',
        'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their',
        'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was',
        'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and',
        'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between',
        'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off',
        'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any',
        'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
        'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'];

    // Split the query into keywords and filter out stop words
    const keywords = query.split(' ').filter(word => !stopWords.includes(word.toLowerCase()));

    // Build the search pattern for each keyword
    const searchPatterns = keywords.map(keyword => `%${keyword}%`);

    try {
        const res = await client.query(`
            SELECT topics.id AS topic_id, topics.name AS topic, content.id AS content_id, content.description, examples.id AS example_id, examples.language, examples.example
            FROM topics
            JOIN content ON topics.id = content.topic_id
            LEFT JOIN examples ON content.id = examples.content_id
            WHERE ${searchPatterns.map((_, index) => `
                topics.name ILIKE $${index + 1} OR
                content.description ILIKE $${index + 1} OR
                examples.example ILIKE $${index + 1}
            `).join(' OR ')}
        `, searchPatterns);

        const results = res.rows.reduce((acc, row) => {
            const topicIndex = acc.findIndex(t => t.topic_id === row.topic_id);
            if (topicIndex > -1) {
                const contentIndex = acc[topicIndex].content.findIndex(c => c.content_id === row.content_id);
                if (contentIndex > -1) {
                    acc[topicIndex].content[contentIndex].examples.push({
                        example_id: row.example_id,
                        language: row.language,
                        text: row.example
                    });
                } else {
                    acc[topicIndex].content.push({
                        content_id: row.content_id,
                        description: row.description,
                        examples: row.example ? [{
                            example_id: row.example_id,
                            language: row.language,
                            text: row.example
                        }] : []
                    });
                }
            } else {
                acc.push({
                    topic_id: row.topic_id,
                    topic: row.topic,
                    content: row.content_id ? [{
                        content_id: row.content_id,
                        description: row.description,
                        examples: row.example ? [{
                            example_id: row.example_id,
                            language: row.language,
                            text: row.example
                        }] : []
                    }] : []
                });
            }
            return acc;
        }, []);

        return { results, originalQuery };
    } finally {
        await client.end();
    }
};

const generateRawOutput = (results, originalQuery, bulletedList) => {
    let output = `Query: ${originalQuery}\n\n`;

    output += results.map(result => {
        let contentOutput = `${result.topic}\n${result.content.map(c => c.description).join('\n')}`;
        result.content.forEach(c => {
            if (c.examples.length) {
                c.examples.forEach(example => {
                    contentOutput += `\n\nExample in ${example.language}:\n${example.text}`;
                });
            }
        });
        return contentOutput;
    }).join('\n\n');

    if (bulletedList) {
        output += ' Please give this to me in a detailed bulleted list format.';
    }

    return output;
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
