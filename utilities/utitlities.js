const { ALPHA_NUM_LOWER } = require('./variables');

exports.catchAsync = (fn) => {
  return (req, res, next) => fn(req, res, next).catch(next);
};

exports.randomFromArray = (arr = [], total = 1) => {
  const newArr = [];
  for (let i = 0; i < total; i++) {
    const anyIndex = Math.trunc(Math.random() * arr.length);
    const value = arr[anyIndex];
    newArr.push(value);
  }

  return newArr;
};

exports.randomAlphaNum = (length) => {
  const values = this.randomFromArray(ALPHA_NUM_LOWER, length);
  return values.join('');
};

exports.formatAmount = (value, currency = 'usd') => {
  value = value / 100;
  const format = new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value);

  return format;
};
