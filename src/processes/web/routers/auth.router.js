const express = require('express');

const auth = require('../../../modules/auth/auth');
const authCtrl = require('../../../modules/auth/auth.controller');

const router = express.Router();

router.route('/')
  .get(auth.authenticate(), authCtrl.getUser)
  .post(authCtrl.generateToken);

module.exports = router;
