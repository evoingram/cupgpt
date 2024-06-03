const logSearchRequest = (req, res, next) => {
    console.log(`Search request: ${req.method} ${req.originalUrl}`);
    next();
};

module.exports = {
    logSearchRequest,
};
