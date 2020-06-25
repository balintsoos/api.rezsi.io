import { Router } from 'express';
import { cors } from './middlewares';
import { healthRouter, authRouter, userRouter, groupRouter } from './routers';

export const router = Router();

router.options('*', cors);
router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/groups', groupRouter);
