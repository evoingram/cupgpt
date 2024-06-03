const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig.development);

const createExample = async (data) => {
    try {
        return await knex('examples').insert(data).returning('id');
    } catch (error) {
        console.error('Error creating example:', error);
        throw error;
    }
};

const getAllExamples = async () => {
    try {
        return await knex('examples').select('*');
    } catch (error) {
        console.error('Error retrieving all examples:', error);
        throw error;
    }
};

const getExampleById = async (id) => {
    try {
        return await knex('examples').where({id}).first();
    } catch (error) {
        console.error(`Error retrieving example by ID (${id}):`, error);
        throw error;
    }
};

const updateExampleById = async (id, data) => {
    try {
        return await knex('examples').where({id}).update(data);
    } catch (error) {
        console.error(`Error updating example by ID (${id}):`, error);
        throw error;
    }
};

const deleteExampleById = async (id) => {
    try {
        return await knex('examples').where({id}).del();
    } catch (error) {
        console.error(`Error deleting example by ID (${id}):`, error);
        throw error;
    }
};

module.exports = {
    createExample,
    getAllExamples,
    getExampleById,
    updateExampleById,
    deleteExampleById,
};
