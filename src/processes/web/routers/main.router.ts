import { Router } from 'express';
import cors from 'cors';
import { corsConfig } from '../cors-config';
import { healthRouter } from './health.router';
import { authRouter } from './auth.router';
import { userRouter } from './user.router';
import { groupRouter } from './group.router';

export const mainRouter = Router();

// enable cors on all OPTIONS
mainRouter.options('*', cors(corsConfig));
mainRouter.use('/health', healthRouter);
mainRouter.use('/auth', authRouter);
mainRouter.use('/users', userRouter);
mainRouter.use('/groups', groupRouter);
