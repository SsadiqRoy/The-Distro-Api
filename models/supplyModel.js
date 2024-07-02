const mongoose = require('mongoose');

const supplySchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.ObjectId, ref: 'Product' },
    newPrice: Number,
    supplierApproved: Boolean,
    sellerAccepted: Boolean,
    quantity: Number,

    createdAt: Date,
    acceptedAt: Date,
    approvedAt: Date,
  },
  {
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

const Supply = mongoose.model('Supply', supplySchema);
module.exports = Supply;
