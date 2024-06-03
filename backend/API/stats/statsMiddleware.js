const logStatsRequest = (req, res, next) => {
    console.log(`Stats request: ${req.method} ${req.originalUrl}`);
    next();
};

module.exports = {
    logStatsRequest,
};
