import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { cors, session } from './middlewares';
import { router } from './router';

export const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(cors);
app.use(session);
app.use('/api/v1', router);
