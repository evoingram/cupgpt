const { logSearchRequest } = require('../searchMiddleware');

describe('logSearchRequest middleware', () => {
    it('should log the search request method and URL and call next', () => {
        const req = {
            method: 'GET',
            originalUrl: '/topics/search'
        };
        const res = {};
        const next = jest.fn();

        console.log = jest.fn(); // Mock the console.log function

        logSearchRequest(req, res, next);

        expect(console.log).toHaveBeenCalledWith('Search request: GET /topics/search');
        expect(next).toHaveBeenCalled();
    });
});
