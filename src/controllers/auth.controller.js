const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

const config = require('../config/main');
const User = require('../models/user.model');

async function login(req, res) {
  if (!req.body.email || !req.body.password) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  let user;

  try {
    user = await User.findOne({ email: req.body.email }).exec();
  } catch (err) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  if (!user) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  const result = await user.comparePassword(req.body.password);

  if (result === false) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  const token = jwt.sign({ id: user.id }, config.jwtSecret);

  return res.json({ token });
}

function logout(req, res) {
  req.logout();
  return res.sendStatus(httpStatus.RESET_CONTENT);
}

module.exports = {
  login,
  logout,
};
