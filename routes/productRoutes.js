const express = require('express');

const controller = require('../controllers/productControllers');
const { onlyLoggedIn, attatchFileToReqBody, beforeAction } = require('../middlewares/globalMiddleware');

const router = express.Router();

router.get('/', controller.allProducts);

router.use(onlyLoggedIn);
router
  .route('/')
  .post(attatchFileToReqBody, controller.newProduct)
  .patch(attatchFileToReqBody, beforeAction('Product'), controller.update);

router.get('/:id', controller.oneProduct);

module.exports = router;
