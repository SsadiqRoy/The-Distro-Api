const express = require('express');

const controller = require('../controllers/zeroControllers');
const { onlyLoggedIn } = require('../middlewares/globalMiddleware');

const router = express.Router();

router.use(onlyLoggedIn);
router.get('/wallet', controller.getWallet);
router.get('/purchase-analytics-products', controller.purchaseAnalyticsByProducts);
router.get('/purchase-analytics-dates', controller.purchaseAnalyticsByDates);

module.exports = router;
