const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const config = require('./main');

/* passport-jwt options
 * https://github.com/themikenicholson/passport-jwt#configure-strategy
 */
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

passport.use(new Strategy(options, async (payload, done) => {
  let user;

  try {
    user = await Users.findOne({ id: payload.sub }).exec();
  } catch (err) {
    return done(err, false);
  }

  if (user) {
    return done(null, user);
  }

  return done(null, false);
}));

module.exports = {
  initialize: () => passport.initialize(),
  authenticate: () => passport.authenticate('jwt', { session: false }),
};
