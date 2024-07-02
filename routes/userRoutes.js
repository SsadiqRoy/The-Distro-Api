const express = require('express');

const controller = require('../controllers/userControllers');
const { onlyLoggedIn, attatchFileToReqBody } = require('../middlewares/globalMiddleware');

const router = express.Router();

router.patch('/login', controller.login);

router.use(onlyLoggedIn);
router.post('/', controller.newUser);
router.get('/', controller.users);
router.patch('/', attatchFileToReqBody, controller.update);
router.patch('/change-password', controller.changePassword);

router.get('/:id', controller.oneUser);

module.exports = router;
