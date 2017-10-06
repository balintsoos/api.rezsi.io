const express = require('express');

const auth = require('../config/auth');
const authCtrl = require('../controllers/auth.controller');

const router = express.Router();

router.route('/')
  .get(auth.authenticate(), authCtrl.getUser);

router.route('/token')
  .post(authCtrl.getToken);

module.exports = router;
