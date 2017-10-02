const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');

const debug = require('debug')('API:auth');

const config = require('./main');
const User = require('../models/user.model');

/* passport-jwt options
 * https://github.com/themikenicholson/passport-jwt#configure-strategy
 */
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

passport.use(new Strategy(options, async (payload, done) => {
  debug(`payload ${payload}`);

  let user;

  try {
    user = await User.findOne({ id: payload.sub }).exec();
  } catch (err) {
    return done(err, false);
  }

  if (!user) {
    return done(null, false);
  }

  return done(null, user);
}));

module.exports = {
  initialize: () => passport.initialize(),
  authenticate: () => passport.authenticate('jwt', { session: false }),
  createToken: payload => jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' }),
};
