const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig.development);

const createTopic = async (data) => {
    try {
        return await knex('topics').insert(data).returning('id');
    } catch (error) {
        console.error('Error creating topic:', error);
        throw error;
    }
};

const getAllTopics = async () => {
    try {
        return await knex('topics').select('*');
    } catch (error) {
        console.error('Error retrieving all topics:', error);
        throw error;
    }
};

const getTopicById = async (id) => {
    try {
        return await knex('topics').where({id}).first();
    } catch (error) {
        console.error(`Error retrieving topic by ID (${id}):`, error);
        throw error;
    }
};

const updateTopicById = async (id, data) => {
    try {
        return await knex('topics').where({id}).update(data);
    } catch (error) {
        console.error(`Error updating topic by ID (${id}):`, error);
        throw error;
    }
};

const deleteTopicById = async (id) => {
    try {
        return await knex('topics').where({id}).del();
    } catch (error) {
        console.error(`Error deleting topic by ID (${id}):`, error);
        throw error;
    }
};

const linkTopics = async (parent_topic_id, child_topic_id) => {
    try {
        return await knex('topic_relationships').insert({parent_topic_id, child_topic_id});
    } catch (error) {
        console.error(`Error linking topics (parent: ${parent_topic_id}, child: ${child_topic_id}):`, error);
        throw error;
    }
};

module.exports = {
    createTopic,
    getAllTopics,
    getTopicById,
    updateTopicById,
    deleteTopicById,
    linkTopics,
};
