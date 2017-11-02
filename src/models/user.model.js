const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const { Types } = mongoose.Schema;

const reportSchema = new mongoose.Schema({
  date: {
    type: Types.Date,
    required: true,
  },
  hotWater: {
    type: Types.Number,
    required: true,
  },
  coldWater: {
    type: Types.Number,
    required: true,
  },
  heat: {
    type: Types.Number,
    required: true,
  },
});

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
  consumptionReports: [reportSchema],
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

userSchema.methods.getLargePayload = function() {
  return {
    id: this.id,
    email: this.email,
    role: this.role,
    displayName: this.displayName,
    consumptionReports: this.consumptionReports,
    group: this.group.name,
  };
};

module.exports = mongoose.model('User', userSchema);
