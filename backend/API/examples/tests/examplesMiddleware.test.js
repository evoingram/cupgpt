/*
Test Cases:
Test case for validateExampleData: Should return 400 if required fields are missing.
Test case for validateExampleData: Should call next middleware if validation passes.

 */
const { validateExampleData } = require('../examplesMiddleware');

describe('validateExampleData', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should return 400 if content_id is missing', () => {
        req.body = { language: 'en', example: 'This is an example' };

        validateExampleData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields: content_id, language, example' });
    });

    it('should return 400 if language is missing', () => {
        req.body = { content_id: 1, example: 'This is an example' };

        validateExampleData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields: content_id, language, example' });
    });

    it('should return 400 if example is missing', () => {
        req.body = { content_id: 1, language: 'en' };

        validateExampleData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields: content_id, language, example' });
    });

    it('should call next middleware if validation passes', () => {
        req.body = { content_id: 1, language: 'en', example: 'This is an example' };

        validateExampleData(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
