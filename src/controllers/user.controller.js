const httpStatus = require('http-status');

const User = require('../models/user.model');

function getAll(req, res) {
  const { limit = 10, skip = 0 } = req.query;

  User.find()
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(users => res.json(users))
    .catch(err => res.status(httpStatus.BAD_REQUEST).json(err));
}

function getOne(req, res) {
  User.findById(req.params.id)
    .exec()
    .then((user) => {
      if (!user) {
        return Promise.reject();
      }

      return user;
    })
    .then(user => res.json(user))
    .catch(err => res.status(httpStatus.BAD_REQUEST).json(err));
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

  return res.status(httpStatus.CREATED).json(user);
}

module.exports = {
  getAll,
  getOne,
  create,
};
