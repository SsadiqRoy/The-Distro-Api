const AppError = require('../classes/AppError');

function globalError(error, req, res, next) {
  const originalMessage = error.message;

  let newerror;

  if (error.kind === 'ObjectId') newerror = objectIdError(error);

  message = newerror?.message || originalMessage;

  res.status(newerror?.statusCode || error.statusCode || 500).json({
    status: 'failed',
    message,
    originalMessage,
    ...(newerror || error),
  });
}

module.exports = globalError;

function objectIdError(error) {
  return new AppError(`Invalid id <${error.value}>`, 406);
}
