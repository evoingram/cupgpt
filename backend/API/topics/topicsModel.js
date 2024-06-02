// backend/API/topics/topicsModel.js
const db = require('../../knexfile');

const addTopic = (topic) => {
    return db('topics').insert(topic).returning('id');
};

const linkTopics = (parent_topic_id, child_topic_id) => {
    return db('topic_relationships').insert({ parent_topic_id, child_topic_id });
};

module.exports = {
    addTopic,
    linkTopics
};
