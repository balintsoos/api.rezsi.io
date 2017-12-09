const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const validateEmail = require('../utils/validateEmail');

const { Types } = mongoose.Schema;

const userSchema = new mongoose.Schema({
  email: {
    type: Types.String,
    required: [true, 'MISSING'],
    unique: true,
    trim: true,
    validate: {
      validator: validateEmail,
      message: 'INVALID',
    },
  },
  password: {
    type: Types.String,
    required: [true, 'MISSING'],
  },
  displayName: {
    type: Types.String,
    required: [true, 'MISSING'],
    trim: true,
  },
  role: {
    type: Types.String,
    required: true,
    enum: ['LEADER', 'MEMBER'],
    default: 'LEADER',
  },
  group: {
    type: Types.ObjectId,
    ref: 'Group',
  },
  confirmed: {
    type: Types.Boolean,
    default: false,
  },
  disabled: {
    type: Types.Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

userSchema.plugin(uniqueValidator, { message: 'EXIST' });

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

userSchema.methods.getLargePayload = function() {
  return {
    id: this.id,
    email: this.email,
    role: this.role,
    displayName: this.displayName,
    group: this.group.getPayload(),
  };
};

userSchema.methods.isLeader = function() {
  return this.role === 'LEADER';
};

userSchema.methods.isMember = function() {
  return this.role === 'MEMBER';
};

module.exports = mongoose.model('User', userSchema);
