const httpStatus = require('http-status');
const debug = require('debug')('API:auth.controller');

const auth = require('../config/auth');
const User = require('../models/user.model');

async function getToken(req, res) {
  if (!req.body.email || !req.body.password) {
    debug('PAYLOAD_VALIDATION_FAILED');
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  let user;

  try {
    user = await User.findOne({ email: req.body.email }).exec();
  } catch (err) {
    debug('DB_FIND_FAILED %O', err);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  if (!user) {
    debug('CANNOT_FIND_USER');
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  if (!user.confirmed) {
    debug('USER_NOT_CONFIRMED');
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  const result = await user.comparePassword(req.body.password);

  if (result === false) {
    debug('PASSWORD_NOT_MATCH');
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  const payload = user.getPayload();

  return res.json({
    user: payload,
    token: auth.createToken(payload),
  });
}

function getUser(req, res) {
  if (!req.user) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  return res.json(req.user.getPayload());
}

module.exports = {
  getToken,
  getUser,
};
