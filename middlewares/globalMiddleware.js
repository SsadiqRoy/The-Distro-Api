const { promisify } = require('node:util');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const { catchAsync } = require('../utilities/utitlities');
const multer = require('multer');
const AppError = require('../classes/AppError');

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  const cookie = req.cookies?.[process.env.cookie_name];
  if (!cookie) return next();

  const decoded = await promisify(jwt.verify)(cookie, process.env.jwt_secrete_key);
  const expires = decoded.exp * 1000;
  const initatedAt = decoded.iat * 1000;

  if (Date.now() > expires) return next();

  const user = await User.findById(decoded.id);
  if (!user) return next();
  if (user.passwordChangedAt && user.passwordChangedAt.getTime() > initatedAt) return next();

  user.ipAddress = req.socket.remoteAddress || req.headers['x-forwarded-for'] || null;
  req.user = user;

  next();
});

exports.onlyLoggedIn = catchAsync(async (req, res, next) => {
  if (req.user) return next();

  const cookie = req.cookies?.[process.env.cookie_name];
  if (!cookie) throw new AppError('You are not logged in. Please log in', 401);

  const decoded = await promisify(jwt.verify)(cookie, process.env.jwt_secrete_key);
  const expires = decoded.exp * 1000;
  const initatedAt = decoded.iat * 1000;

  if (Date.now() > expires) throw new AppError('Your log in period ended. Please log in again', 400);

  const user = await User.findById(decoded.id);
  if (!user) throw new AppError('No account found as logged in. Please log in again', 404);
  if (user.passwordChangedAt && user.passwordChangedAt.getTime() > initatedAt)
    throw new AppError('Please log in again. You changed your password', 400);

  user.ipAddress = req.socket.remoteAddress || req.headers['x-forwarded-for'] || null;
  req.user = user;

  next();
});

exports.attatchFileToReqBody = multer({ storage: multer.memoryStorage() }).single('image');
