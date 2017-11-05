const express = require('express');

const auth = require('../config/auth');
const groupCtrl = require('../controllers/group.controller');
const userCtrl = require('../controllers/user.controller');

const router = express.Router();

router.route('/')
  .get(auth.authenticate(), userCtrl.isLeader, groupCtrl.getAllOfUser)
  .post(auth.authenticate(), userCtrl.isLeader, groupCtrl.create);

router.route('/:id')
  .get(auth.authenticate(), userCtrl.isLeader, groupCtrl.getOneOfUser);

router.route('/:groupId/users/:userId')
  .get(auth.authenticate(), userCtrl.isLeader, groupCtrl.getMemberOfGroup)
  .delete(auth.authenticate(), userCtrl.isLeader, groupCtrl.deleteMemberOfGroup);

module.exports = router;
