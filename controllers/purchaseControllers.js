const AppError = require('../utilities/classes/AppError');
const Purchase = require('../models/purchaseModel');
const { approvePurchase, filterQuery } = require('../utilities/supportControllers');
const { catchAsync, randomAlphaNum } = require('../utilities/utitlities');

exports.newPurchase = catchAsync(async (req, res, next) => {
  const { product, quantity, price } = req.body;
  const purchaseId = randomAlphaNum(10).toUpperCase();

  const purchase = await Purchase.create({ product, quantity, price, purchaseId });

  res.status(200).json({
    status: 'success',
    message: `Thank you for purchasing our products`,
    data: purchase,
  });
});

//

exports.update = catchAsync(async (req, res, next) => {
  const { status, id } = req.body;

  if (req.purchase.status === 'approved') return next(new AppError(`You have already approved this purchase. #${req.purchase.purchaseId}`));
  if (req.purchase.status === 'declined') return next(new AppError(`Purchase #${req.purchase.purchaseId} has already been declined`));
  if (status === 'pending') return next(new AppError('You can not set status to pending', 406));

  const updateBody = { status, statusChangedAt: new Date() };

  if (status === 'approved') {
    const product = await approvePurchase(req.purchase);
    updateBody.basePrice = product.buyingPrice;
  }
  const purchase = await Purchase.findByIdAndUpdate(id, updateBody, { new: true, runValidators: true });

  let message;
  if (status === 'approved') message = `You have successfully approve purchase #${purchase.purchaseId}`;
  if (status === 'declined') message = `You have declined purchase #${purchase.purchaseId}`;

  res.status(200).json({
    status: 'success',
    message,
    data: purchase,
  });
});

//

exports.allPurchases = catchAsync(async (req, res, next) => {
  req.query.populate = [{ path: 'product', select: 'name image quantity buyingPrice sellingPrice' }];

  const { data, meta } = await filterQuery(Purchase, req.query);

  res.status(200).json({
    status: 'success',
    meta,
    data,
  });
});

//

exports.onePurchase = catchAsync(async (req, res, next) => {
  const purchase = await Purchase.findOne({ purchaseId: req.params.purchaseId });

  res.status(200).json({
    status: 'success',
    data: purchase,
  });
});

exports.onePurchaseById = catchAsync(async (req, res, next) => {
  const purchase = await Purchase.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: purchase,
  });
});
