const express = require('express');
const httpStatus = require('http-status');

const router = express.Router();

router.route('/').get((req, res) => res.sendStatus(httpStatus.OK));

module.exports = router;
