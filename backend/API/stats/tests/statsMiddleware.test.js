const { logStatsRequest } = require('../statsMiddleware');

describe('logStatsRequest middleware', () => {
    it('should log the stats request method and URL and call next', () => {
        const req = {
            method: 'POST',
            originalUrl: '/topics/stats'
        };
        const res = {};
        const next = jest.fn();

        console.log = jest.fn(); // Mock the console.log function

        logStatsRequest(req, res, next);

        expect(console.log).toHaveBeenCalledWith('Stats request: POST /topics/stats');
        expect(next).toHaveBeenCalled();
    });
});
