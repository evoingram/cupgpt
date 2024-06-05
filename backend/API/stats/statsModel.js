module.exports = (knex) => {
    const getTopicsCount = async () => {
        try {
            const result = await knex('topics').count('id as count').first();
            console.log(`topics result = ${JSON.stringify(result)}`);
            return parseInt(result.count, 10);
        } catch (error) {
            console.error('Error retrieving topics count:', error);
            throw error;
        }
    };

    const getContentCount = async () => {
        try {
            const result = await knex('content').count('id as count').first();
            console.log(`content result = ${JSON.stringify(result)}`);
            return parseInt(result.count, 10);
        } catch (error) {
            console.error('Error retrieving content count:', error);
            throw error;
        }
    };

    const getExamplesCount = async () => {
        try {
            const result = await knex('examples').count('id as count').first();
            console.log(`example result = ${JSON.stringify(result)}`);
            return parseInt(result.count, 10);
        } catch (error) {
            console.error('Error retrieving examples count:', error);
            throw error;
        }
    };

    return {
        getTopicsCount,
        getContentCount,
        getExamplesCount,
    };
};
