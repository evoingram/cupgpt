// backend/API/content/contentsMiddleware.js

// Middleware for validating content data
const validateContentData = (req, res, next) => {
    const {topic_id, description} = req.body;
    if (!topic_id || !description) {
        return res.status(400).json({error: 'Missing required fields: topic_id, description'});
    }
    next();
};
module.exports = {validateContentData};
