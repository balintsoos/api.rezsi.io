const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const { Types } = mongoose.Schema;

const userSchema = new mongoose.Schema({
  email: {
    type: Types.String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: Types.String,
    required: true,
  },
  displayName: {
    type: Types.String,
    required: true,
    trim: true,
  },
  role: {
    type: Types.String,
    required: true,
    enum: ['LEADER', 'MEMBER'],
    default: 'MEMBER',
  },
  group: {
    type: Types.ObjectId,
    ref: 'Group',
  },
  confirmed: {
    type: Types.Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

userSchema.plugin(uniqueValidator);

userSchema.pre('save', function(next) {
  if (!this.isModified('password') && !this.isNew) {
    return next();
  }

  const user = this;

  return bcrypt.hash(user.password, 10)
    .then((hash) => {
      user.password = hash;
      next();
    });
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.getPayload = function() {
  return {
    id: this.id,
    email: this.email,
    role: this.role,
    displayName: this.displayName,
  };
};

module.exports = mongoose.model('User', userSchema);
