const createExample = async (data, knex) => {
    if (!data.content_id || !data.language || !data.example) {
        throw new Error('Missing required fields: content_id, language, example');
    }

    try {
        return await knex('examples').insert(data).returning('id');
    } catch (error) {
        console.error('Error creating example:', error);
        throw error;
    }
};

const getAllExamples = async (knex) => {
    try {
        return await knex('examples').select('*');
    } catch (error) {
        console.error('Error retrieving all examples:', error);
        throw error;
    }
};

const getExampleById = async (id, knex) => {
    try {
        return await knex('examples').where({ id }).first();
    } catch (error) {
        console.error(`Error retrieving example by ID (${id}):`, error);
        throw error;
    }
};

const updateExampleById = async (id, data, knex) => {
    try {
        return await knex('examples').where({ id }).update(data);
    } catch (error) {
        console.error(`Error updating example by ID (${id}):`, error);
        throw error;
    }
};

const deleteExampleById = async (id, knex) => {
    try {
        return await knex('examples').where({ id }).del();
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
