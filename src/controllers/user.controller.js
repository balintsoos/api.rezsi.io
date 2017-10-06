const httpStatus = require('http-status');
const debug = require('debug')('API:user.controller');

const User = require('../models/user.model');
const mail = require('../config/mail');
const { apiUrl, clientUrl } = require('../utils/getUrl');
const confirmEmail = require('../utils/confirmEmail');

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
  let user = new User(Object.assign({}, req.body, {
    role: 'LEADER',
  }));

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

  try {
    user = await user.save();
  } catch (err) {
    debug('USER_SAVE_FAILED %O', err);
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  return res.status(httpStatus.CREATED).json(user.getPayload());
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

module.exports = {
  getAll,
  getOne,
  create,
  confirm,
};
