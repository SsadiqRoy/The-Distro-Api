function globalError(error, req, res, next) {
  res.status(500).json({
    status: 'failed',
    ...error,
  });
}

module.exports = globalError;
