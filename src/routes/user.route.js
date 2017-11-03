const express = require('express');

const userCtrl = require('../controllers/user.controller');

const router = express.Router();

router.route('/')
  .post(userCtrl.create);

router.route('/:id/confirm')
  .get(userCtrl.confirm);

module.exports = router;
