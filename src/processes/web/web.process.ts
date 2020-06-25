import http from 'http';
import util from 'util';
import mongoose from 'mongoose';
import debug from 'debug';

import { config } from '../../config';
import { app } from './app';
const wss = require('../../modules/wss');

const log = debug('API:index')
const dbLog = debug('API:db');

const server = http.createServer(app);

const db = mongoose.connection;
const mongoUrl = config.mongo.url;

db.on('connecting', () => log(`Connecting to database: ${mongoUrl}`));
db.on('connected', () => log(`Connected to database: ${mongoUrl}`));
db.once('open', () => log(`Connection is open to database: ${mongoUrl}`));
db.on('error', () => log(`Unable to connect to database: ${mongoUrl}`));
db.on('reconnected', () => log(`Reconnected to database: ${mongoUrl}`));
db.on('disconnected', () => log(`Disconnected from database: ${mongoUrl}`));

mongoose.set('debug', (collectionName: any, method: any, query: any, doc: any) => {
  dbLog(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
});

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
});

wss.addServer(server);

server.listen(config.port, () => {
  debug(`Server started on port ${config.port} (${config.env})`);
});
