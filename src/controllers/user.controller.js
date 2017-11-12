const httpStatus = require('http-status');
const mongoose = require('mongoose');
const debug = require('debug')('API:user.controller');

const User = require('../models/user.model');
const mail = require('../config/mail');
const { apiUrl, clientUrl } = require('../utils/getUrl');
const confirmEmail = require('../utils/confirmEmail');
const getEmailDomain = require('../utils/getEmailDomain');

async function getAll(req, res) {
  const { limit = 10, skip = 0 } = req.query;

  let users;

  try {
    users = await User.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  return res.json(users.map(user => user.getPayload()));
}

async function getOne(req, res) {
  let user;

  try {
    user = await User.findById(req.params.id).exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  if (!user) {
    return res.status(httpStatus.BAD_REQUEST);
  }

  return res.json(user.getPayload());
}

async function create(req, res) {
  if (req.body.group) {
    req.body.group = mongoose.Types.ObjectId(req.body.group);
    req.body.role = 'MEMBER';
  }

  let user = new User(req.body);

  try {
    user = await user.save();
  } catch (err) {
    debug('USER_SAVE_FAILED %O', err);
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  try {
    await mail.send({
      to: user.email,
      subject: 'Confirm your email address',
      html: confirmEmail({
        name: user.displayName,
        url: apiUrl(`/users/${user.id}/confirm`),
      }),
    });
  } catch (err) {
    debug('EMAIL_SEND_FAILED %O', err);
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  return res.status(httpStatus.CREATED).json({
    domain: getEmailDomain(user.email),
  });
}

async function confirm(req, res) {
  try {
    await User.findByIdAndUpdate(req.params.id, { confirmed: true }).exec();
  } catch (err) {
    debug('USER_CONFIRM_FAILED %O', err);
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  return res.redirect(clientUrl('/login'));
}

async function getAllOfGroup(req, res) {
  let users;

  try {
    users = await User.find({
      role: 'MEMBER',
      group: req.group.id,
      confirmed: true,
      disabled: false,
    }).sort({ createdAt: -1 }).exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  return res.json(users.map(user => user.getPayload()));
}

async function getOneOfGroup(req, res) {
  let user;

  try {
    user = await User.findOne({
      _id: mongoose.Types.ObjectId(req.params.userId),
      role: 'MEMBER',
      group: req.group.id,
      confirmed: true,
      disabled: false,
    }).exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  if (!user) {
    return res.status(httpStatus.BAD_REQUEST);
  }

  return res.json(user.getPayload());
}

async function deleteOneOfGroup(req, res) {
  let deletedUser;

  try {
    deletedUser = await User
      .findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.params.userId),
        role: 'MEMBER',
        group: req.group.id,
        confirmed: true,
        disabled: false,
      }, { disabled: true }, { new: true })
      .exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  if (!deletedUser) {
    return res.status(httpStatus.BAD_REQUEST);
  }

  return res.json({ id: deletedUser.id });
}

function isLeader(req, res, next) {
  if (!req.user.isLeader()) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  return next();
}

function isMember(req, res, next) {
  if (!req.user.isMember()) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  return next();
}

async function isMemberOfGroup(req, res, next) {
  let member;

  try {
    member = await User.findOne({
      _id: mongoose.Types.ObjectId(req.params.userId),
      role: 'MEMBER',
      group: req.group.id,
      disabled: false,
    }).exec();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  if (!member) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  req.member = member;

  return next();
}

async function isLeaderOrMemberOfGroup(req, res, next) {
  if (req.user.isLeader()) {
    try {
      req.member = await User.findOne({
        _id: mongoose.Types.ObjectId(req.params.userId),
        role: 'MEMBER',
        group: req.group.id,
        disabled: false,
      }).exec();
    } catch (err) {
      return res.status(httpStatus.BAD_REQUEST).json(err);
    }
  }

  if (req.user.isMember() && req.user.id.toString() === req.params.userId) {
    req.member = req.user;
  }

  if (!req.member) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  return next();
}

module.exports = {
  create,
  confirm,
  getAll,
  getOne,
  getAllOfGroup,
  getOneOfGroup,
  deleteOneOfGroup,
  isLeader,
  isMember,
  isMemberOfGroup,
  isLeaderOrMemberOfGroup,
};
