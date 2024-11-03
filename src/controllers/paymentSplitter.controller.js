const httpStatus = require('http-status');
const ErrorResponse = require('../utils/errorResponse');

const SplitTypes = ['FLAT', 'PERCENTAGE', 'RATIO'];

/**
 * Compute payment splitting based on the provided transaction details and split rules.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>} - A Promise that resolves when the computation is complete.
 */
async function computePaymentSplitting(req, res, next) {
    try {
        const { ID, Amount, SplitInfo } = req.body;

        // Cache the order of split types and create a map for faster lookup
        const order = SplitTypes;
        const splitTypeIndexMap = Object.fromEntries(order.map((type, index) => [type, index]));

        // Sort SplitInfo based on precedence rules
        const sortedSplitInfo = SplitInfo.sort((a, b) => splitTypeIndexMap[a.SplitType] - splitTypeIndexMap[b.SplitType]);

        let balance = Amount;
        const splitBreakdown = [];
        let totalRatio = 0;

        // Iterate through each split entity and calculate the split amount
        for (const splitInfo of sortedSplitInfo) {
            let amount = 0;
            const { SplitType, SplitValue, SplitEntityId } = splitInfo;

            switch (SplitType) {
                case 'FLAT':
                    amount = Math.min(SplitValue, balance);
                    break;
                case 'PERCENTAGE':
                    amount = Math.min((SplitValue / 100) * balance, balance);
                    break;
                case 'RATIO':
                    if (totalRatio === 0) {
                        for (const curr of sortedSplitInfo) {
                            if (curr.SplitType === 'RATIO') {
                                totalRatio += curr.SplitValue;
                            }
                        }
                    }
                    amount = Math.min((SplitValue / totalRatio) * balance, balance);
                    break;
                default:
                    next(new ErrorResponse('Invalid SplitType', 400));
                    return;
            }

            // Record the split breakdown
            splitBreakdown.push({ SplitEntityId, Amount: amount });

            // Update the balance for the next iteration
            balance -= amount;

            // Exit early when balance becomes 0
            if (balance === 0) {
                break;
            }
        }

        // Check constraints to ensure the validity of the computation
        if (balance < 0 || splitBreakdown.some((item) => item.Amount < 0) || splitBreakdown.reduce((acc, curr) => acc + curr.Amount, 0) > Amount) {
            next(new ErrorResponse('Invalid computation. Check constraints.', 400));
            return;
        }

        // Respond with the computed results
        res.status(httpStatus.OK).json({
            ID,
            Balance: balance,
            SplitBreakdown: splitBreakdown,
        });
    } catch (error) {
        console.error(error.message)
        next(error);
    }
}

module.exports = { computePaymentSplitting };