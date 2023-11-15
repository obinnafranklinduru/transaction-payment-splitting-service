const request = require('supertest');
const { mockPaymentSplitting } = require('../data/mockedData');
const app = require('../app');

describe('Split Payments API', () => {
    it('should compute split payments and return a valid response', async () => {
        const response = await request(app)
            .post('/split-payments/compute')
            .send(mockPaymentSplitting.payload1)
            .expect(200);

        expect(response.body).toHaveProperty('ID');
        expect(response.body).toHaveProperty('Balance');
        expect(response.body).toHaveProperty('SplitBreakdown');
    });

    it('should handle empty SplitInfo array and return a valid response', async () => {
        const response = await request(app)
            .post('/split-payments/compute')
            .send(mockPaymentSplitting.payload2)
            .expect(200);

        expect(response.body).toHaveProperty('ID');
        expect(response.body).toHaveProperty('Balance');
        expect(response.body).toHaveProperty('SplitBreakdown');
    });
});