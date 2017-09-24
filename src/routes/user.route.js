const express = require('express');

const auth = require('../config/auth');
const userCtrl = require('../controllers/user.controller');

const router = express.Router();

router.route('/')
  .get(auth.authenticate(), userCtrl.getAll)
  .post(auth.authenticate(), userCtrl.create);

router.route('/:id')
  .get(auth.authenticate(), userCtrl.getOne);

module.exports = router;
