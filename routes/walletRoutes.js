const express = require('express');

const { getWallet } = require('../controllers/walletControllers');
const { onlyLoggedIn } = require('../middlewares/globalMiddleware');

const router = express.Router();

router.get('/', onlyLoggedIn, getWallet);

module.exports = router;
