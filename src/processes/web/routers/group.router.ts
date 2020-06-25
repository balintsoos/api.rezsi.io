import { Router } from 'express';

const auth = require('../../../modules/auth/auth');
const groupCtrl = require('../../../modules/group/group.controller');
const userCtrl = require('../../../modules/user/user.controller');
const summaryCtrl = require('../../../modules/summary/summary.controller');
const reportCtrl = require('../../../modules/report/report.controller');
const billCtrl = require('../../../modules/bill/bill.controller');

export const groupRouter = Router();

groupRouter.route('/')
  .get(auth.authenticate(), userCtrl.isLeader, groupCtrl.getAllOfLeader)
  .post(auth.authenticate(), userCtrl.isLeader, groupCtrl.create);

groupRouter.route('/:id')
  .get(auth.authenticate(), userCtrl.isLeader, groupCtrl.getOneOfLeader)
  .patch(auth.authenticate(), userCtrl.isLeader, groupCtrl.updateOneOfLeader)
  .delete(auth.authenticate(), userCtrl.isLeader, groupCtrl.deleteOneOfLeader);

groupRouter.route('/:id/summaries')
  .get(auth.authenticate(), userCtrl.isLeader, groupCtrl.isLeaderOfGroup, summaryCtrl.getAllOfGroup)
  .post(auth.authenticate(), userCtrl.isLeader, groupCtrl.isLeaderOfGroup, summaryCtrl.create);

groupRouter.route('/:id/summaries/:summaryId/csv')
  .get(
    auth.authenticate(),
    userCtrl.isLeader,
    groupCtrl.isLeaderOfGroup,
    summaryCtrl.getOneAsCsvOfGroup,
  );

groupRouter.route('/:id/users')
  .get(
    auth.authenticate(),
    userCtrl.isLeader,
    groupCtrl.isLeaderOfGroup,
    userCtrl.getAllOfGroup,
  );

groupRouter.route('/:id/users/:userId')
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

groupRouter.route('/:id/users/:userId/reports')
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

groupRouter.route('/:id/users/:userId/bills')
  .get(
    auth.authenticate(),
    groupCtrl.isLeaderOrMemberOfGroup,
    userCtrl.isLeaderOrMemberOfGroup,
    billCtrl.getAllOfMember,
  );

groupRouter.route('/:id/users/:userId/bills/:billId/pdf')
  .get(
    auth.authenticate(),
    groupCtrl.isLeaderOrMemberOfGroup,
    userCtrl.isLeaderOrMemberOfGroup,
    billCtrl.getOneAsPdfOfMember,
  );
