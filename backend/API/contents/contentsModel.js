

const createContent = async (data, knex) => {
    if (!data.topic_id || !data.description) {
        throw new Error('Missing required fields: topic_id, description');
    }

    try {
        return await knex('content').insert(data).returning('id');
    } catch (error) {
        console.error('Error creating content:', error);
        throw error;
    }
};


const getAllContent = async (knex) => {
    try {
        return await knex('content').select('*');
    } catch (error) {
        console.error('Error retrieving all content:', error);
        throw error;
    }
};

const getContentById = async (id, knex) => {
    try {
        return await knex('content').where({id}).first();
    } catch (error) {
        console.error(`Error retrieving content by ID (${id}):`, error);
        throw error;
    }
};

const updateContentById = async (id, data, knex) => {
    try {
        return await knex('content').where({id}).update(data);
    } catch (error) {
        console.error(`Error updating content by ID (${id}):`, error);
        throw error;
    }
};

const deleteContentById = async (id, knex) => {
    try {
        return await knex('content').where({id}).del();
    } catch (error) {
        console.error(`Error deleting content by ID (${id}):`, error);
        throw error;
    }
};

const searchContentByTopic = async (topic, knex) => {
    try {
        const parentId = await knex('topics').where({name: topic}).select('id').first();

        if (!parentId) {
            return [];
        }

        const results = await knex('content')
            .leftJoin('topic_relationships', 'content.topic_id', 'topic_relationships.child_topic_id')
            .where('topic_relationships.parent_topic_id', parentId.id)
            .orWhere('content.topic_id', parentId.id)
            .select('content.description');

        return results || [];
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
