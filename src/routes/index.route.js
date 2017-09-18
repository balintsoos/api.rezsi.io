const express = require('express');
const httpStatus = require('http-status');
const authRoutes = require('./auth.route');

const router = express.Router(); // eslint-disable-line new-cap

// Check service health
router.route('/health').get((req, res) => res.sendStatus(httpStatus.OK));

router.use('/auth', authRoutes);

module.exports = router;
