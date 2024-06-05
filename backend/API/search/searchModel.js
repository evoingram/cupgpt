const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig.development);

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
    searchContentByTopic,
};
