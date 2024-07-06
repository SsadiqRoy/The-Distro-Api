class AppError extends Error {
  constructor(message, statusCode, { url, textCode, errorCode } = {}) {
    super(message);

    this.status = String(statusCode).startsWith('4') ? 'failed' : 'error';
    this.statusCode = statusCode;
    this.isOperational = true;
    this.targetUrl = url;
    this.textCode = textCode;
    this.errorCode = errorCode;
    this._message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
