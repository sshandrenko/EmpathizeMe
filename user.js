// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  // add any other fields you might need
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

userSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, (err, match) => {
    if (err) return callback(err);
    callback(null, match);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
