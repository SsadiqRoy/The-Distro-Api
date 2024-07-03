const path = require('node:path');
const sharp = require('sharp');
const { promisify } = require('node:util');
const { unlink } = require('node:fs');

const Product = require('../models/productModel');
const Purchase = require('../models/purchaseModel');
const Supply = require('../models/supplyModel');
const User = require('../models/userModel');
const Wallet = require('../models/walletModel');

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

exports.getWallet = async () => {
  const wallet = (await Wallet.find())[0];

  return wallet;
};
