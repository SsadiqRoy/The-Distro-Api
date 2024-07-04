const AppError = require('../classes/AppError');
const Purchase = require('../models/purchaseModel');
const { approvePurchase } = require('../utilities/supportControllers');
const { catchAsync, randomAlphaNum } = require('../utilities/utitlities');

/* =============== ACTIVITIES 
  - Making purchase
  - Declining purchase
    * Can not decline when approved
  - Approving purchase
    * Can not approve when declined

  - Getting all purchases
  - Gettin one purchase
*/

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

  if (status === 'approved') await approvePurchase(req.purchase);
  const purchase = await Purchase.findByIdAndUpdate(id, { status, statusChangedAt: new Date() }, { new: true, runValidators: true });

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
