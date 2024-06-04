const { connectToDatabase, disconnectFromDatabase } = require('./connect_database');

const handleSearchQuery = async (query, options = {}) => {
    console.log(`Starting to handle search query: ${query}.`);
    console.log("Received options:", options);

    const client = await connectToDatabase();

    const stopWords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves',
        'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their',
        'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was',
        'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and',
        'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between',
        'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off',
        'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any',
        'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
        'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'];

    const keywords = query.split(' ').filter(word => !stopWords.includes(word.toLowerCase()));
    const searchPatterns = keywords.map(keyword => `%${keyword}%`);

    try {
        const res = await client.query(`
            SELECT topics.id   AS topic_id,
                   topics.name AS topic,
                   content.id  AS content_id,
                   content.description,
                   examples.id AS example_id,
                   examples.language,
                   examples.example
            FROM topics
                     JOIN content ON topics.id = content.topic_id
                     LEFT JOIN examples ON content.id = examples.content_id
            WHERE ${searchPatterns.map((_, index) => `
                topics.name ILIKE $${index + 1} OR
                content.description ILIKE $${index + 1} OR
                examples.example ILIKE $${index + 1}
            `).join(' OR ')}
        `, searchPatterns);

        const results = res.rows.reduce((acc, row) => {
            const topicIndex = acc.findIndex(t => t.topic_id === row.topic_id);
            if (topicIndex > -1) {
                const contentIndex = acc[topicIndex].content.findIndex(c => c.content_id === row.content_id);
                if (contentIndex > -1) {
                    acc[topicIndex].content[contentIndex].examples.push({
                        example_id: row.example_id,
                        language: row.language,
                        text: row.example
                    });
                } else {
                    acc[topicIndex].content.push({
                        content_id: row.content_id,
                        description: row.description,
                        examples: row.example ? [{
                            example_id: row.example_id,
                            language: row.language,
                            text: row.example
                        }] : []
                    });
                }
            } else {
                acc.push({
                    topic_id: row.topic_id,
                    topic: row.topic,
                    content: row.content_id ? [{
                        content_id: row.content_id,
                        description: row.description,
                        examples: row.example ? [{
                            example_id: row.example_id,
                            language: row.language,
                            text: row.example
                        }] : []
                    }] : []
                });
            }
            return acc;
        }, []);

        console.log('Results before generating raw output:', results);

        const rawOutput = generateRawOutput(results, query, options);
        console.log('Generated output:', rawOutput);

        return { results, rawOutput };
    } finally {
        await disconnectFromDatabase(client);
    }
};

const generateRawOutput = (results, originalQuery, options = {}) => {
    console.log('Generating raw output');
    console.log('Options received:', options);

    let output = `Query: ${originalQuery}\n\n`;

    output += results.map(result => {
        let contentOutput = `${result.topic}\n${result.content.map(c => c.description).join('\n')}`;
        result.content.forEach(c => {
            if (c.examples.length) {
                c.examples.forEach(example => {
                    contentOutput += `\n\nExample in ${example.language}:\n${example.text}`;
                });
            }
        });
        return contentOutput;
    }).join('\n\n');

    if (options.bulletedList) {
        output += "\n\nPlease give this to me in a detailed bulleted list format.";
    }
    if (options.accuracy) {
        output += "\n\nPlease be as accurate as possible and do not make anything up.";
    }
    if (options.includeSources) {
        output += "\n\nPlease include the sources you used to provide this information.";
    }
    if (options.myWritingStyle) {
        output += "\n\nPlease write this in my writing style as much as possible.";
    }
    if (options.searchInternet) {
        output += "\n\nPlease search the internet for the most up-to-date information as possible on this inquiry.";
    }
    if (options.bestPractices) {
        output += "\n\nPlease apply best practices and clean code principles to wherever it is appropriate and as much as possible.";
    }

    console.log("Done generating raw output.");
    return output;
};

module.exports = { handleSearchQuery, generateRawOutput };
