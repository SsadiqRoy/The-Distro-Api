const { default: mongoose } = require('mongoose');
const Product = require('../models/productModel');
const Purchase = require('../models/purchaseModel');
const { getWallet, aggregationQuery } = require('../utilities/supportControllers');
const { catchAsync } = require('../utilities/utitlities');

exports.getWallet = catchAsync(async (req, res, next) => {
  const wallet = await getWallet();

  res.status(200).json({
    status: 'success',
    data: wallet,
  });
});

//

exports.purchaseAnalyticsByProducts = catchAsync(async (req, res, next) => {
  // { $match: { status: 'approved' } },
  const stages = [
    {
      $project: {
        _id: '$_id',
        product: '$product',
        quantity: '$quantity',
        totalPrice: { $multiply: ['$quantity', '$price'] },
        totalBasePrice: { $multiply: ['$quantity', '$basePrice'] },
      },
    },
    {
      $addFields: {
        profit: { $subtract: ['$totalPrice', '$totalBasePrice'] },
      },
    },
    {
      $group: {
        _id: '$product',
        cost: { $sum: '$totalBasePrice' },
        sales: { $sum: '$totalPrice' },
        profit: { $sum: '$profit' },
        quantity: { $sum: '$quantity' },
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $project: {
        _id: '$_id',
        cost: { $divide: ['$cost', 100] },
        sales: { $divide: ['$sales', 100] },
        profit: { $divide: ['$profit', 100] },

        sold: '$quantity',
        name: '$product.name',
        color: '$product.color',
      },
    },
    { $sort: { sales: -1 } },
  ];

  const { data, meta } = await aggregationQuery(Purchase, req.query, stages);

  res.status(200).json({
    status: 'success',
    meta,
    data,
  });
});

//

exports.purchaseAnalyticsByDates = catchAsync(async (req, res, next) => {
  const stages = [
    {
      $project: {
        _id: '$_id',
        product: '$product',
        date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        sold: '$quantity',
        sales: { $multiply: ['$quantity', '$price'] },
        cost: { $multiply: ['$quantity', '$basePrice'] },
      },
    },
    {
      $addFields: {
        profit: { $subtract: ['$sales', '$cost'] },
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'item',
      },
    },
    { $unwind: '$item' },

    {
      $project: {
        _id: '$_id',
        date: { $dateFromString: { dateString: '$date' } },
        sold: '$sold',
        sales: { $divide: ['$sales', 100] },
        cost: { $divide: ['$cost', 100] },
        profit: { $divide: ['$profit', 100] },
        product: '$product',
        name: '$item.name',
        color: '$item.color',
      },
    },

    { $sort: { date: 1 } },
  ];

  const { data, meta } = await aggregationQuery(Purchase, req.query, stages);

  res.status(200).json({
    status: 'success',
    meta,
    data,
  });
});
