const express = require('express');

const auth = require('../config/auth');
const reportCtrl = require('../controllers/report.controller');
const userCtrl = require('../controllers/user.controller');

const router = express.Router();

router.route('/')
  .get(auth.authenticate(), userCtrl.isMember, reportCtrl.getAllOfUser)
  .post(auth.authenticate(), userCtrl.isMember, reportCtrl.create);

module.exports = router;
