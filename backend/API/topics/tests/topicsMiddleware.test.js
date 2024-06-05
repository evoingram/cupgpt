/*
Test Cases:
Test case for validateTopicData: Should return 400 if required fields are missing.
Test case for validateTopicData: Should call next middleware if validation passes.
Test case for validateLinkData: Should return 400 if required fields are missing.
Test case for validateLinkData: Should call next middleware if validation passes.
 */

const { validateTopicData, validateLinkData } = require('../topicsMiddleware');

describe('topicsMiddleware', () => {

    describe('validateTopicData', () => {
        it('should return 400 if the required field "name" is missing', () => {
            const req = { body: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateTopicData(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Missing required field: name' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next middleware if validation passes', () => {
            const req = { body: { name: 'Test topic' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateTopicData(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('validateLinkData', () => {
        it('should return 400 if required fields "parent_topic_id" or "child_topic_id" are missing', () => {
            const req = { body: { parent_topic_id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateLinkData(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields: parent_topic_id, child_topic_id' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next middleware if validation passes', () => {
            const req = { body: { parent_topic_id: 1, child_topic_id: 2 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateLinkData(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });
});
