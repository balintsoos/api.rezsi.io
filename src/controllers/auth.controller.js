const httpStatus = require('http-status');

const auth = require('../config/auth');
const User = require('../models/user.model');

async function token(req, res) {
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

  const payload = user.getPayload();

  return res.json({
    user: payload,
    token: auth.createToken(payload),
  });
}

module.exports = {
  token,
};
