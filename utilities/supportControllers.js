const path = require('node:path');
const sharp = require('sharp');
const { promisify } = require('node:util');
const { unlink } = require('node:fs');

const Product = require('../models/productModel');
const Purchase = require('../models/purchaseModel');
const Supply = require('../models/supplyModel');
const User = require('../models/userModel');
const Wallet = require('../models/walletModel');
const AppError = require('../classes/AppError');
const { formatAmount } = require('./utitlities');
const QueryFeatures = require('../classes/QueryFeatures');

exports.allModels = { User, Product, Supply, Purchase };

//

exports.uploadImage = async ({ file, suffix, folder = 'admins' }) => {
  const id = crypto.randomUUID().split('-').join('').slice(0, 10);
  const filename = `${id}-${suffix}.jpg`;

  await sharp(file.buffer)
    .toFormat('jpg')
    .jpeg({ quality: 100 })
    .toFile(path.join(__dirname, `../public/images/${folder}/${filename}`));

  return filename;
};

//

exports.deleteImage = async (filename, folder = 'admins') => {
  if (filename.startsWith('default')) return true;

  await promisify(unlink)(path.join(__dirname, `../public/images/${folder}/${filename}`));
  return true;
};

//

exports.approvePurchase = async (purchase) => {
  const product = await Product.findById(purchase.product);

  if (purchase.quantity > product.quantity)
    throw new AppError(`Not enough stock. Available: ${product.quantity} requested: ${purchase.quantity}`, 422);

  const total = purchase.quantity * purchase.price;
  const wallet = await this.getWallet();

  await Product.findByIdAndUpdate(purchase.product, { $inc: { quantity: -Number(purchase.quantity) } });
  await Wallet.findByIdAndUpdate(wallet.id, { $inc: { balance: total } });
};

//

exports.acceptSupplyResponse = async (supply) => {
  const { balance, id: walletId } = await this.getWallet();
  const total = supply.newPrice * supply.quantity;

  if (total >= balance)
    throw new AppError(
      `Not enough fund. Balance: ${formatAmount(balance)} Cost: ${formatAmount(total)}. Need: ${formatAmount(total - balance)} more.`
    );

  await Product.findByIdAndUpdate(supply.product, { buyingPrice: supply.newPrice, $inc: { quantity: supply.quantity } });
  await Wallet.findByIdAndUpdate(walletId, { $inc: { balance: -total } });
};

//

exports.getWallet = async () => {
  const wallet = (await Wallet.find())[0];

  return wallet;
};

//

exports.makeSupplyRequest = async (body) => {
  const supply = await Supply.create(body);
  return supply;
};

//

exports.filterQuery = async (Schema, query) => {
  return await new QueryFeatures(Schema, query).execute();
};
