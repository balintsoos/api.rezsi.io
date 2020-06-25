import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { corsConfig } from './cors.config';
import { router } from './router';
const auth = require('../../modules/auth/auth');

export const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(cors(corsConfig));
app.use(auth.initialize());
app.use('/api/v1', router);
