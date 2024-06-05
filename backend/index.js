// TODO:  Need more tests in backend/index.js

require('dotenv').config();
const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);
const cors = require('cors');
const {Client} = require('pg');
const topicsRouter = require('./API/topics/topicsRouter');
const contentsRouter = require('./API/contents/contentsRouter');
const examplesRouter = require('./API/examples/examplesRouter');
const searchRouter = require('./API/search/searchRouter');
const statsRouter = require('./API/stats/statsRouter');

const app = express();
app.use(express.json());
app.use(cors({origin: 'http://localhost:3001'}));

console.log('Initializing backend...');

// Add this route at the top of your other routes
app.get('/health', (req, res) => {
    res.status(200).send('Healthy');
});


// Root route for basic check
app.get('/', (req, res) => {
    console.log('Root route accessed');
    res.send('Welcome to CupGPT: A Coding Monkey Wizard');
});

// Test route to check database connection
app.get('/test-db', async (req, res) => {
    try {
        console.log('Testing database connection...');
        const result = await db.raw('SELECT 1+1 AS result');
        console.log('Database connection successful');
        res.json(result.rows);
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({error: err.message});
    }
});

// Verify seed data endpoint
app.get('/verify-seed', async (req, res) => {
    try {
        console.log('Verifying seed data...');
        const topics = await db('topics').select('*');
        const content = await db('content').select('*');
        const examples = await db('examples').select('*');

        res.json({
            topics,
            content,
            examples,
        });
    } catch (err) {
        console.error('Error verifying seed data:', err);
        res.status(500).json({error: 'Failed to verify seed data', details: err.message});
    }
});

// Routers
app.use('/topics', (req, res, next) => {
    console.log('Accessing /topics route');
    next();
}, topicsRouter);

app.use('/content', (req, res, next) => {
    console.log('Accessing /content route');
    next();
}, contentsRouter);

app.use('/examples', (req, res, next) => {
    console.log('Accessing /examples route');
    next();
}, examplesRouter);

app.use('/search', (req, res, next) => {
    console.log('Accessing /search route');
    next();
}, searchRouter);

app.use('/stats', (req, res, next) => {
    console.log('Accessing /stats route');
    next();
}, statsRouter);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({error: 'Internal Server Error', details: err.message});
});

const PORT = process.env.PORT || 3000;
const TESTING_PORT = process.env.TESTING_PORT || 3005;

if (process.env.NODE_ENV === 'test') {
    app.listen(TESTING_PORT, () => {
        console.log(`Server is running on port ${TESTING_PORT} in test mode`);
    });
} else {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
