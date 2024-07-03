const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
  {
    balance: { type: Number, default: 0 },
  },
  { toJSON: { virtuals: true, versionKey: false }, toObject: { versionKey: false, virtuals: true } }
);

const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;
