import { Router } from 'express';

const auth = require('../../../modules/auth/auth');
const authCtrl = require('../../../modules/auth/auth.controller');

export const authRouter = Router();

authRouter.route('/')
  .get(auth.authenticate(), authCtrl.getUser)
  .post(authCtrl.generateToken);

