const express = require('express');
const { computePaymentSplitting } = require('../../controllers/paymentSplitter.controller');

const router = express.Router();

router.post('/compute', computePaymentSplitting)

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Endpoints for split payments computation
 */

/**
 * @swagger
 * /split-payments/compute:
 *   post:
 *     summary: Calculate the amount due to one or more split payment 'entities'
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PayloadData'
 *     responses:
 *       200:
 *         description: Transaction payment splitting is computed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentSplitterResponse'
 *       400:
 *         description: Error occured during payment splitting computation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */