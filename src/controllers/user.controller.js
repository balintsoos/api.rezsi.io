const httpStatus = require('http-status');

const User = require('../models/user.model');
const mail = require('../config/mail');
const { apiUrl, clientUrl } = require('../utils/getUrl');

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
    user = await user.save();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  try {
    await mail.send({
      to: user.email,
      subject: 'Confirm your email address',
      text: apiUrl(`/users/${user.id}/confirm`),
      html: apiUrl(`/users/${user.id}/confirm`),
    });
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  return res.status(httpStatus.CREATED).json(user.getPayload());
}

async function confirm(req, res) {
  try {
    await User.findOneAndUpdate({ id: req.params.id }, { confirmed: true }).exec();
  } catch (err) {
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
