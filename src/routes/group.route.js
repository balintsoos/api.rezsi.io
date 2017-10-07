const express = require('express');

const auth = require('../config/auth');
const groupCtrl = require('../controllers/group.controller');
const userCtrl = require('../controllers/user.controller');

const router = express.Router();

router.route('/')
  .get(auth.authenticate(), groupCtrl.getAllOfUser)
  .post(auth.authenticate(), userCtrl.isLeader, groupCtrl.create);

router.route('/:id')
  .get(auth.authenticate(), groupCtrl.getOneOfUser);

module.exports = router;
