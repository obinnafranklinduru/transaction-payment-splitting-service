const httpStatus = require('http-status');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Compute payment splitting based on the provided transaction details and split rules.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>} - A Promise that resolves when the computation is complete.
 */
async function computePaymentSplitting(req, res, next) {
    try {
        const { ID, Amount, Currency, CustomerEmail, SplitInfo } = req.body;

        // Cache the order of split types
        const order = ['FLAT', 'PERCENTAGE', 'RATIO'];

        // Sort SplitInfo based on precedence rules
        const sortedSplitInfo = SplitInfo.sort((a, b) => order.indexOf(a.SplitType) - order.indexOf(b.SplitType));

        let balance = Amount;
        const splitBreakdown = [];
        let totalRatio = 0;

        // Iterate through each split entity and calculate the split amount
        for (const { SplitType, SplitValue, SplitEntityId } of sortedSplitInfo) {
            let amount = 0;

            switch (SplitType) {
                case 'FLAT':
                    amount = Math.min(SplitValue, balance);
                    break;
                case 'PERCENTAGE':
                    amount = Math.min((SplitValue / 100) * balance, balance);
                    break;
                case 'RATIO':
                    if (totalRatio === 0) {
                        totalRatio = sortedSplitInfo.filter((info) => info.SplitType === 'RATIO').reduce((acc, curr) => acc + curr.SplitValue, 0);
                    }
                    amount = Math.min((SplitValue / totalRatio) * balance, balance);
                    break;
                default:
                    next(new ErrorResponse('Invalid SplitType', 400));
            }

            // Record the split breakdown
            splitBreakdown.push({ SplitEntityId, Amount: amount });

            // Update the balance for the next iteration
            balance -= amount;
        }

        // Check constraints to ensure the validity of the computation
        if (balance < 0 || splitBreakdown.some((item) => item.Amount < 0) || splitBreakdown.reduce((acc, curr) => acc + curr.Amount, 0) > Amount) {
            next(new ErrorResponse('Invalid computation. Check constraints.', 400));
        }

        // Respond with the computed results
        res.status(httpStatus.OK).json({
            ID,
            Balance: balance,
            SplitBreakdown: splitBreakdown
        });
    } catch (error) {
        // Pass any errors to the error-handling middleware
        next(error);
    }
}

module.exports = { computePaymentSplitting };