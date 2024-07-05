const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    surname: { type: String, required: [true, 'Surname is required'] },
    otherNames: String,
    email: { type: String, unique: [true, 'Email is alread registerd. Try loging in'], required: [true, 'Email is required'] },
    image: { type: String, default: 'default.jpg' },
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

userSchema.virtual('fullname').get(function () {
  if (this.surname) return `${this.otherNames || ''} ${this.surname}`;
});

userSchema.pre('save', async function () {
  const old = this.password;

  const password = await bcrypt.hash(this.password, 13);
  this.password = password;

  console.log('old', old, 'hashed', this.password);

  if (this.isNew) this.createdAt = new Date();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
