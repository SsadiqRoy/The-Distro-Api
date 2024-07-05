const AppError = require('../classes/AppError');
const TPH = require('./thirdPartyHandlers');

const localErrorTypes = {
  types: ['objectId', 'uniqueField', 'minLength'],

  objectId: (error) => {
    const { value } = TPH.mongoDbObjectIdError(error);
    return new AppError(`Invalid id <${value}>`, 406);
  },

  uniqueField: (error) => {
    const { key, value } = TPH.mongoDbDuplicateError(error);
    return new AppError(`The ${key} ${value} is already used`, 417);
  },

  minLength: (error) => {
    const { key, value } = TPH.mongoDbMinLengthError(error);
    return new AppError(`${key} should be at least ${value}`);
  },
};

function globalError(error, req, res, next) {
  const originalMessage = error.message;
  TPH.attatchLocalType(error);

  let newerror;
  if (localErrorTypes.types.includes(error.localType)) newerror = localErrorTypes[error.localType](error);

  message = newerror?.message || originalMessage;

  res.status(newerror?.statusCode || error.statusCode || 500).json({
    status: 'failed',
    message,
    originalMessage,
    ...(newerror || error),
  });
}

module.exports = globalError;
