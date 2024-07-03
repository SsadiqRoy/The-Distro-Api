const bcrypt = require('bcrypt');
const { promisify } = require('node:util');
const jwt = require('jsonwebtoken');

const { catchAsync } = require('../utilities/utitlities');
const User = require('../models/userModel');
const { uploadAdminImage, deleteAdminImage } = require('../utilities/supportControllers');
const AppError = require('../classes/AppError');

//

exports.newUser = catchAsync(async (req, res, next) => {
  const { surname, otherNames, email, password } = req.body;
  const body = { surname, otherNames, email, password };

  const user = await User.create(body);

  res.status(200).json({
    status: 'success',
    message: 'You have added a new admin',
    data: user,
  });
});

//

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new AppError('Email or password is incorrect', 406);

  const compare = await bcrypt.compare(password, user.password);
  if (!compare) throw new AppError('Email or password is incorrect', 406);

  const token = jwt.sign({ id: user.id }, process.env.jwt_secrete_key, { expiresIn: process.env.jwt_expires, issuer: process.env.jwt_issuer });

  res.cookie(process.env.cookie_name, token, {
    httpOnly: true,
    expires: new Date(Date.now() + +process.env.cookie_expires),
    secure: true,
    doman: process.env.cookie_domain,
  });

  res.status(200).json({
    status: 'success',
    message: `Welcome back ${user.otherNames}`,
    data: user,
  });
});

//

exports.update = catchAsync(async (req, res, next) => {
  const { surname, otherNames, email } = req.body;
  const body = { surname, otherNames, email, updatedAt: Date.now() };

  if (req.file) {
    const filename = await uploadImage({ file: req.file, suffix: req.user.id });
    body.image = filename;

    req.user.image && (await deleteImage(req.user.image));
  }

  const user = await User.findByIdAndUpdate(req.user.id, body, { new: true, runValidators: true });

  res.status(200).json({
    status: 'success',
    message: 'Account details updated',
    data: user,
  });
});

//

exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');
  const compare = await bcrypt.compare(currentPassword, user.password);

  if (!compare) return next(new AppError('Current password is not correct', 406));

  const newuser = await user.save({ password: currentPassword, passwordChangedAt: Date.now() });

  res.status(200).json({
    status: 'success',
    message: 'Password has been updated',
    data: newuser,
  });
});

//

exports.users = catchAsync(async (req, res, next) => {
  const data = await User.find();

  res.status(200).json({
    status: 'success',
    length: data.length,
    data,
  });
});

//

exports.oneUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: user,
  });
});
