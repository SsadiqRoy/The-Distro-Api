const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.ObjectId, ref: 'Product' },
    quantity: Number,
    status: { type: String, enum: ['pending', 'approved', 'declined'] },

    createdAt: Date,
    statusChangedAt: Date,
  },
  {
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;
