// backend/API/content/contentsModel.js
const db = require('../../knexfile');

const addContent = (content) => {
    return db('content').insert(content).returning('id');
};

const findTopicByName = (name) => {
    return db('topics').where({ name }).select('id').first();
};

const searchContent = (parentId) => {
    return db('content')
        .join('topic_relationships', 'content.topic_id', 'topic_relationships.child_topic_id')
        .where('topic_relationships.parent_topic_id', parentId)
        .orWhere('content.topic_id', parentId)
        .select('content.description');
};

module.exports = {
    addContent,
    findTopicByName,
    searchContent
};
