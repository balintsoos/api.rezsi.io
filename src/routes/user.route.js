const express = require('express');

const auth = require('../config/auth');
const userCtrl = require('../controllers/user.controller');

const router = express.Router();

router.route('/')
  .post(userCtrl.create);

router.route('/:id')
  .get(auth.authenticate(), userCtrl.getOne);

router.route('/:id/confirm')
  .get(userCtrl.confirm);

module.exports = router;
