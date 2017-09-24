const User = require('../models/user.model');

function getAll(req, res, next) {
  const { limit = 10, skip = 0 } = req.query;

  User.find()
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(users => res.json(users))
    .catch(e => next(e));
}

function getOne(req, res, next) {
  User.findById(req.params.id)
    .exec()
    .then((user) => {
      if (!user) {
        return Promise.reject();
      }

      return user;
    })
    .then(user => res.json(user))
    .catch(e => next(e));
}

function create(req, res, next) {
  const user = new User(req.body);

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

module.exports = {
  getAll,
  getOne,
  create,
};
