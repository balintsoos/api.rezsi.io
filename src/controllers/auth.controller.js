const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../config/main');

async function login(req, res) {
  if (req.body.email && req.body.password) {
    let user;

    try {
      user = await Users.findOne({
        email: req.body.email,
        password: req.body.password,
      }).exec();
    } catch (err) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    if (user) {
      const token = jwt.sign({ id: user.id }, config.jwtSecret);

      return res.json({ token });
    }
  }

  return res.sendStatus(httpStatus.UNAUTHORIZED);
}

module.exports = {
  login,
};
