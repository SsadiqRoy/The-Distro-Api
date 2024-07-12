const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.ObjectId, ref: 'Product' },
    basePrice: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'Product cost is required'] },
    quantity: { type: Number, min: 1, required: [true, 'Quantity of products is required'] },
    status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
    purchaseId: { type: String, required: true, unique: true },

    createdAt: Date,
    statusChangedAt: Date,
  },
  {
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

purchaseSchema.virtual('totalPrice').get(function () {
  return this.price * this.quantity;
});
purchaseSchema.virtual('profit').get(function () {
  return this.price * this.quantity - this.basePrice * this.quantity;
});

purchaseSchema.pre('save', function () {
  if (this.isNew) this.createdAt = new Date();
});

const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;
