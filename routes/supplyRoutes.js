const express = require('express');

const controller = require('../controllers/supllyControllers');
const { onlyLoggedIn, beforeAction } = require('../middlewares/globalMiddleware');

const router = express.Router();

router.get('/', controller.allSupplies);
router.get('/:id', controller.oneSupply);

router.use(onlyLoggedIn);
router.route('/').post(controller.request).patch(controller.changePrice);
router.patch('/approval', beforeAction('Supply'), controller.approval);
router.patch('/acceptance', beforeAction('Supply'), controller.acceptance);
router.patch('/cancelation', beforeAction('Supply'), controller.cancelation);

module.exports = router;
