import { Router } from 'express';

const userCtrl = require('../../../modules/user/user.controller');

export const userRouter = Router();

userRouter.route('/')
  .post(userCtrl.create);

userRouter.route('/:id/confirm')
  .get(userCtrl.confirm);
