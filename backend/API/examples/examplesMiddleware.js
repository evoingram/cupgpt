// Middleware for validating example data
const validateExampleData = (req, res, next) => {
    const {content_id, language, example} = req.body;
    if (!content_id || !language || !example) {
        return res.status(400).json({error: 'Missing required fields: content_id, language, example'});
    }
    next();
};
module.exports = {
    validateExampleData
};
