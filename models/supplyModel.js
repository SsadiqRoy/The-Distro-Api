const mongoose = require('mongoose');

const supplySchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.ObjectId, ref: 'Product' },
    newPrice: Number,
    quantity: { type: Number, min: 1 },
    supplierApproved: { type: Boolean, default: false },
    requesterAccepted: { type: Boolean, default: false },
    active: { type: Boolean, default: true },

    requestedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    createdAt: Date,
    acceptedAt: Date,
    approvedAt: Date,
  },
  {
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

supplySchema.pre('save', function () {
  if (this.isNew) this.createdAt = new Date();
});

const Supply = mongoose.model('Supply', supplySchema);
module.exports = Supply;
