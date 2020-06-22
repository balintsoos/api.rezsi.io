const express = require('express');

const auth = require('../../../config/auth');
const groupCtrl = require('../../../modules/group/group.controller');
const userCtrl = require('../../../modules/user/user.controller');
const summaryCtrl = require('../../../modules/summary/summary.controller');
const reportCtrl = require('../../../modules/report/report.controller');
const billCtrl = require('../../../modules/bill/bill.controller');

const router = express.Router();

router.route('/')
  .get(auth.authenticate(), userCtrl.isLeader, groupCtrl.getAllOfLeader)
  .post(auth.authenticate(), userCtrl.isLeader, groupCtrl.create);

router.route('/:id')
  .get(auth.authenticate(), userCtrl.isLeader, groupCtrl.getOneOfLeader)
  .patch(auth.authenticate(), userCtrl.isLeader, groupCtrl.updateOneOfLeader)
  .delete(auth.authenticate(), userCtrl.isLeader, groupCtrl.deleteOneOfLeader);

router.route('/:id/summaries')
  .get(auth.authenticate(), userCtrl.isLeader, groupCtrl.isLeaderOfGroup, summaryCtrl.getAllOfGroup)
  .post(auth.authenticate(), userCtrl.isLeader, groupCtrl.isLeaderOfGroup, summaryCtrl.create);

router.route('/:id/summaries/:summaryId/csv')
  .get(
    auth.authenticate(),
    userCtrl.isLeader,
    groupCtrl.isLeaderOfGroup,
    summaryCtrl.getOneAsCsvOfGroup,
  );

router.route('/:id/users')
  .get(
    auth.authenticate(),
    userCtrl.isLeader,
    groupCtrl.isLeaderOfGroup,
    userCtrl.getAllOfGroup,
  );

router.route('/:id/users/:userId')
  .get(
    auth.authenticate(),
    userCtrl.isLeader,
    groupCtrl.isLeaderOfGroup,
    userCtrl.getOneOfGroup,
  )
  .delete(
    auth.authenticate(),
    userCtrl.isLeader,
    groupCtrl.isLeaderOfGroup,
    userCtrl.deleteOneOfGroup,
  );

router.route('/:id/users/:userId/reports')
  .get(
    auth.authenticate(),
    groupCtrl.isLeaderOrMemberOfGroup,
    userCtrl.isLeaderOrMemberOfGroup,
    reportCtrl.getAllOfMember,
  )
  .post(
    auth.authenticate(),
    userCtrl.isMember,
    reportCtrl.create,
  );

router.route('/:id/users/:userId/bills')
  .get(
    auth.authenticate(),
    groupCtrl.isLeaderOrMemberOfGroup,
    userCtrl.isLeaderOrMemberOfGroup,
    billCtrl.getAllOfMember,
  );

router.route('/:id/users/:userId/bills/:billId/pdf')
  .get(
    auth.authenticate(),
    groupCtrl.isLeaderOrMemberOfGroup,
    userCtrl.isLeaderOrMemberOfGroup,
    billCtrl.getOneAsPdfOfMember,
  );

module.exports = router;
