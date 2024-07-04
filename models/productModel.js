const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'] },
    image: { type: String },
    color: { type: String, required: [true, 'Color is required'] },
    buyingPrice: { type: Number, required: [true, 'Buying price is required'], default: 0 },
    sellingPrice: { type: Number, required: [true, 'Selling price is required'], default: 0 },
    quantity: { type: Number, required: [true, 'Quantity is required'], default: 0 },
    description: String,

    addedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    createdAt: Date,
  },
  {
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

productSchema.virtual('profit').get(function () {
  if (!this.buyingPrice || !this.sellingPrice) return 0;
  return this.sellingPrice - this.buyingPrice;
});

productSchema.virtual('profitPercent').get(function () {
  if (!this.buyingPrice || !this.sellingPrice) return 0;
  const profit = this.sellingPrice - this.buyingPrice;
  return Math.round((profit / this.buyingPrice) * 100);
});

productSchema.pre('save', function () {
  if (this.isNew) this.createdAt = new Date();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
