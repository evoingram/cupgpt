// Add any middleware functions if needed

// Middleware for validating topic data
const validateTopicData = (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        console.log('Validation failed: missing name');
        return res.status(400).json({ error: 'Missing required field: name' });
    }
    next();
};

// Middleware for validating link data
const validateLinkData = (req, res, next) => {
    const { parent_topic_id, child_topic_id } = req.body;
    if (!parent_topic_id || !child_topic_id) {
        console.log('Validation failed: missing parent_topic_id or child_topic_id');
        return res.status(400).json({ error: 'Missing required fields: parent_topic_id, child_topic_id' });
    }
    next();
};

module.exports = { validateTopicData, validateLinkData };
