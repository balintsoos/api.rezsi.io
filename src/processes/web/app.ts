import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import compress from 'compression';

import { config } from '../../config';
const auth = require('../../modules/auth/auth');
const router = require('./routers/main.router');

const corsConfig = {
  origin: config.client.origin,
  credentials: true,
  exposedHeaders: ['Content-Disposition'],
};

export const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors(corsConfig));
app.use(compress());
app.use(auth.initialize());
app.use("/api/v1", router);
