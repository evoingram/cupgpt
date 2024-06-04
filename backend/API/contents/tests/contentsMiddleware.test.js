const { validateContentData } = require('../contentsMiddleware');

describe('validateContentData', () => {
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

    it('should return 400 if both topic_id and description are missing', () => {
        validateContentData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields: topic_id, description' });
    });

    it('should return 400 if topic_id is missing', () => {
        req.body = { description: 'Test description' };

        validateContentData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields: topic_id, description' });
    });

    it('should return 400 if description is missing', () => {
        req.body = { topic_id: 1 };

        validateContentData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields: topic_id, description' });
    });

    it('should call next middleware if validation passes', () => {
        req.body = { topic_id: 1, description: 'Test description' };

        validateContentData(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should call next middleware if there are extra fields', () => {
        req.body = { topic_id: 1, description: 'Test description', extra_field: 'Extra field' };

        validateContentData(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
