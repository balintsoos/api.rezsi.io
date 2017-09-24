const express = require('express');
const httpStatus = require('http-status');

const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const groupRoutes = require('./group.route');

const router = express.Router();

// Check service health
router.route('/health').get((req, res) => res.sendStatus(httpStatus.OK));

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/groups', groupRoutes);

module.exports = router;
