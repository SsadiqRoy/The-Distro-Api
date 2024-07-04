const AppError = require('../classes/AppError');
const Product = require('../models/productModel');
const { uploadImage, deleteImage, makeSupplyRequest, filterQuery } = require('../utilities/supportControllers');
const { catchAsync } = require('../utilities/utitlities');

exports.newProduct = catchAsync(async (req, res, next) => {
  const { name, color, buyingPrice, sellingPrice, quantity, description } = req.body;
  const body = { name, color, buyingPrice, sellingPrice, description, addedBy: req.user.id };

  let product = await Product.create(body);

  if (req.file) {
    const filename = await uploadImage({ file: req.file, suffix: product.id, folder: 'products' });
    product = await Product.findByIdAndUpdate(product.id, { image: filename }, { new: true });
  }

  await makeSupplyRequest({ product: product.id, quantity, newPrice: buyingPrice, requestedBy: req.user.id });

  res.status(200).json({
    status: 'success',
    message: 'New product added',
    data: product,
  });
});

//

exports.update = catchAsync(async (req, res, next) => {
  const { id, name, color, buyingPrice, sellingPrice, quantity, description } = req.body;
  const body = { name, color, buyingPrice, sellingPrice, quantity, description };

  if (req.file) {
    const currentProduct = await Product.findById(id);
    const filename = await uploadImage({ file: req.file, suffix: currentProduct.id, folder: 'products' });

    body.image = filename;
    deleteImage(currentProduct.image, 'products');
  }

  const product = await Product.findByIdAndUpdate(id, body, { runValidators: true, new: true });

  res.status(200).json({
    status: 'success',
    message: 'New product added',
    data: product,
  });
});

//

exports.allProducts = catchAsync(async (req, res, next) => {
  req.query.searchFields = 'name';

  const { data, meta } = await filterQuery(Product, req.query);

  res.status(200).json({
    status: 'success',
    meta,
    data,
  });
});

//

exports.oneProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: product,
  });
});
