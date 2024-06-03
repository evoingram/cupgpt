const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig.development);

const createContent = async (data) => {
    try {
        return await knex('content').insert(data).returning('id');
    } catch (error) {
        console.error('Error creating content:', error);
        throw error;
    }
};

const getAllContent = async () => {
    try {
        return await knex('content').select('*');
    } catch (error) {
        console.error('Error retrieving all content:', error);
        throw error;
    }
};

const getContentById = async (id) => {
    try {
        return await knex('content').where({id}).first();
    } catch (error) {
        console.error(`Error retrieving content by ID (${id}):`, error);
        throw error;
    }
};

const updateContentById = async (id, data) => {
    try {
        return await knex('content').where({id}).update(data);
    } catch (error) {
        console.error(`Error updating content by ID (${id}):`, error);
        throw error;
    }
};

const deleteContentById = async (id) => {
    try {
        return await knex('content').where({id}).del();
    } catch (error) {
        console.error(`Error deleting content by ID (${id}):`, error);
        throw error;
    }
};

const searchContentByTopic = async (topic) => {
    try {
        const parentId = await knex('topics').where({name: topic}).select('id').first();
        if (!parentId) {
            return null;
        }
        return await knex('content')
            .join('topic_relationships', 'content.topic_id', 'topic_relationships.child_topic_id')
            .where('topic_relationships.parent_topic_id', parentId.id)
            .orWhere('content.topic_id', parentId.id)
            .select('content.description');
    } catch (error) {
        console.error(`Error searching content by topic (${topic}):`, error);
        throw error;
    }
};

module.exports = {
    createContent,
    getAllContent,
    getContentById,
    updateContentById,
    deleteContentById,
    searchContentByTopic,
};
