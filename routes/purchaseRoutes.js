const express = require('express');

const controller = require('../controllers/purchaseControllers');
const { onlyLoggedIn, beforeAction } = require('../middlewares/globalMiddleware');

const router = express.Router();

router.post('/', controller.newPurchase);

router.use(onlyLoggedIn);
router.route('/').patch(beforeAction('Purchase'), controller.update).get(controller.allPurchases);
router.get('/:purchaseId', controller.onePurchase);
router.get('/id/:id', controller.onePurchaseById);

module.exports = router;
