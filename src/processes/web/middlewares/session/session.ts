import session from 'express-session';
import connectMongodbSession from 'connect-mongodb-session';
import { config } from '../../../../config';

const MongodbStore = connectMongodbSession(session);
const store = new MongodbStore({
  uri: config.mongo.url,
  collection: 'sessions',
});

export default session({
  store,
  secret: config.session.secret,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  resave: true,
  saveUninitialized: true,
});
