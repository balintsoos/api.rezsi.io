const express = require('express');

const auth = require('../config/auth');
const groupCtrl = require('../controllers/group.controller');
const userCtrl = require('../controllers/user.controller');
const reportCtrl = require('../controllers/report.controller');

const router = express.Router();

router.route('/')
  .get(auth.authenticate(), userCtrl.isLeader, groupCtrl.getAllOfLeader)
  .post(auth.authenticate(), userCtrl.isLeader, groupCtrl.create);

router.route('/:id')
  .get(auth.authenticate(), userCtrl.isLeader, groupCtrl.getOneOfLeader);

router.route('/:id/users')
  .get(auth.authenticate(), userCtrl.isLeader, userCtrl.getAllOfGroup);

router.route('/:id/reports')
  .get(auth.authenticate(), userCtrl.isLeader, reportCtrl.getAllOfGroup);

router.route('/:groupId/users/:userId')
  .get(auth.authenticate(), userCtrl.isLeader, userCtrl.getOneOfGroup)
  .delete(auth.authenticate(), userCtrl.isLeader, userCtrl.deleteOneOfGroup);

router.route('/:groupId/users/:userId/reports')
  .get(auth.authenticate(), reportCtrl.getAllOfUser)
  .post(auth.authenticate(), userCtrl.isMember, reportCtrl.create);

module.exports = router;
