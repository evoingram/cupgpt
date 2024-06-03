const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig.development);

const getTopicsCount = async () => {
    try {
        const count = await knex('topics').count('id as count').first();
        return count.count;
    } catch (error) {
        console.error('Error retrieving topics count:', error);
        throw error;
    }
};

const getContentCount = async () => {
    try {
        const count = await knex('content').count('id as count').first();
        return count.count;
    } catch (error) {
        console.error('Error retrieving content count:', error);
        throw error;
    }
};

const getExamplesCount = async () => {
    try {
        const count = await knex('examples').count('id as count').first();
        return count.count;
    } catch (error) {
        console.error('Error retrieving examples count:', error);
        throw error;
    }
};

module.exports = {
    getTopicsCount,
    getContentCount,
    getExamplesCount,
};
