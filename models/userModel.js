const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    surname: { type: String, required: [true, 'Surname is required'] },
    otherNames: String,
    email: { type: String, unique: [true, 'Email is alread registerd. Try loging in'], required: [true, 'Email is required'] },
    image: String,
    password: { type: String, select: false, required: [true, 'Password is required'], minlength: 8 },
    addedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },

    createdAt: Date,
    updatedAt: Date,
    passwordChangedAt: Date,
  },
  {
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

userSchema.pre('save', async function () {
  // console.log('incoming data', this);
  const password = await bcrypt.hash(this.password, 13);
  // console.log(password);
  this.password = password;
});

const User = mongoose.model('User', userSchema);
module.exports = User;
