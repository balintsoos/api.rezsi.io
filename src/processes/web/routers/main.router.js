const express = require('express');
const cors = require('../middlewares/cors');
const healthRouter = require('./health.router');
const authRouter = require('./auth.router');
const userRouter = require('./user.router');
const groupRouter = require('./group.router');

const router = express.Router();

// enable cors on all OPTIONS
router.options('*', cors());

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/groups', groupRouter);

module.exports = router;
