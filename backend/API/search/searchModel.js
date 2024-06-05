const searchContentByTopic = async (topic, knex) => {
    try {
        console.log(`Searching content by topic: ${topic}`);
        const parentId = await knex('topics').where({ name: topic }).select('id').first();
        console.log('Parent ID:', parentId);
        if (!parentId) {
            return null;
        }
        const results = await knex('content')
            .leftJoin('topic_relationships', 'content.topic_id', 'topic_relationships.child_topic_id')
            .where(function() {
                this.where('topic_relationships.parent_topic_id', parentId.id)
                    .orWhere('content.topic_id', parentId.id)
            })
            .select('content.description');
        console.log('Search results:', results);
        return results;
    } catch (error) {
        console.error(`Error searching content by topic (${topic}):`, error);
        throw error;
    }
};

module.exports = {
    searchContentByTopic,
};
