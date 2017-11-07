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
  .get(auth.authenticate(), userCtrl.isLeader, groupCtrl.getOneOfLeader)
  .patch(auth.authenticate(), userCtrl.isLeader, groupCtrl.updateOneOfLeader)
  .delete(auth.authenticate(), userCtrl.isLeader, groupCtrl.deleteOneOfLeader);

router.route('/:id/users')
  .get(auth.authenticate(), groupCtrl.isLeaderOfGroup, userCtrl.getAllOfGroup);

router.route('/:id/users/:userId')
  .get(auth.authenticate(), groupCtrl.isLeaderOfGroup, userCtrl.getOneOfGroup)
  .delete(auth.authenticate(), groupCtrl.isLeaderOfGroup, userCtrl.deleteOneOfGroup);

router.route('/:id/users/:userId/reports')
  .get(auth.authenticate(), reportCtrl.getAllOfUser) // TODO
  .post(auth.authenticate(), userCtrl.isMember, reportCtrl.create);

module.exports = router;
