import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { corsConfig } from './cors-config';
const auth = require('../../modules/auth/auth');
const router = require('./routers/main.router');

export const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(cors(corsConfig));
app.use(auth.initialize());
app.use("/api/v1", router);
