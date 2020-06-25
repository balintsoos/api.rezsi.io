import { Router } from 'express';
import cors from 'cors';
import { corsConfig } from './cors.config';
import * as routers from './routers';

export const router = Router();

router.options('*', cors(corsConfig));
router.use('/health', routers.healthRouter);
router.use('/auth', routers.authRouter);
router.use('/users', routers.userRouter);
router.use('/groups', routers.groupRouter);
