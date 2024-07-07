const AppError = require('../utilities/classes/AppError');
const Product = require('../models/productModel');
const Supply = require('../models/supplyModel');
const Wallet = require('../models/walletModel');
const { getWallet, acceptSupplyResponse, filterQuery } = require('../utilities/supportControllers');
const { catchAsync } = require('../utilities/utitlities');

/*



*/

exports.request = catchAsync(async (req, res, next) => {
  const { product: productId, quantity } = req.body;
  const body = { product: productId, quantity, requestedBy: req.user.id };

  const product = await Product.findById(productId).select('buyingPrice');
  body.newPrice = product.buyingPrice;

  const supply = await Supply.create(body);

  res.status(200).json({
    status: 'success',
    message: 'Supply request sent',
    data: supply,
  });
});

//

exports.approval = catchAsync(async (req, res, next) => {
  const { supplierApproved, id } = req.body;

  const status = req.supply.requesterAccepted ? 'accepted' : 'canceled';
  if (!req.supply.active) return next(new AppError(`Request has been ${status}`, 401));

  const supply = await Supply.findByIdAndUpdate(id, { supplierApproved, approvedAt: new Date() }, { new: true });

  res.status(200).json({
    status: 'success',
    message: 'You have approved the supply request',
    data: supply,
  });
});

//

exports.acceptance = catchAsync(async (req, res, next) => {
  const { requesterAccepted, id } = req.body;
  const { supplierApproved, active, requesterAccepted: accepted } = req.supply;

  if (!active) return next(new AppError(`Supply has been ${accepted ? 'accepted' : 'canceled'}`, 401));
  if (!supplierApproved) return next(new AppError('Supplier has not approved request', 401));

  if (requesterAccepted) await acceptSupplyResponse(req.supply);
  const supply = await Supply.findByIdAndUpdate(id, { requesterAccepted, active: false, acceptedAt: new Date() }, { new: true });

  res.status(200).json({
    status: 'success',
    message: 'You have accepted to pay the price given',
    data: supply,
  });
});

//

exports.cancelation = catchAsync(async (req, res, next) => {
  const { id } = req.body;

  const supply = await Supply.findByIdAndUpdate(id, { active: false, acceptedAt: new Date() }, { new: true });

  res.status(200).json({
    status: 'success',
    message: 'Your supply request has been canceled',
    data: supply,
  });
});

//

exports.changePrice = catchAsync(async (req, res, next) => {
  const { newPrice, id } = req.body;

  const supply = await Supply.findByIdAndUpdate(id, { newPrice }, { new: true });

  res.status(200).json({
    status: 'success',
    message: 'Product supply price changed',
    data: supply,
  });
});

//

exports.allSupplies = catchAsync(async (req, res, next) => {
  req.query.populate = [{ path: 'product', select: 'name image buyingPrice' }];
  const { data, meta } = await filterQuery(Supply, req.query);

  res.status(200).json({
    status: 'success',
    meta,
    data,
  });
});

//

exports.oneSupply = catchAsync(async (req, res, next) => {
  const supply = await Supply.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: supply,
  });
});
