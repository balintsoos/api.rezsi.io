const express = require('express');
const httpStatus = require('http-status');

const auth = require('../config/auth');
const authCtrl = require('../controllers/auth.controller');

const router = express.Router();

// Check authentication status
router.route('/')
  .get(auth.authenticate(), (req, res) => res.sendStatus(httpStatus.OK));

router.route('/login')
  .post(authCtrl.login);

module.exports = router;
