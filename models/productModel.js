const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    color: String,
    buyingPrice: Number,
    sellingPrice: Number,
    quantity: Number,
    description: Number,

    createdAt: Date,
  },
  {
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
