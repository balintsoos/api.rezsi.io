import { Router } from 'express';
import httpStatus from 'http-status';

export const healthRouter = Router();

healthRouter.route('/').get((_, res) => res.sendStatus(httpStatus.OK));
