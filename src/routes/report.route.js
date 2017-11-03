const express = require('express');

const auth = require('../config/auth');
const reportCtrl = require('../controllers/report.controller');

const router = express.Router();

router.route('/')
  .get(auth.authenticate(), reportCtrl.getAllOfUser)
  .post(auth.authenticate(), reportCtrl.create);

module.exports = router;
