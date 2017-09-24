const express = require('express');

const auth = require('../config/auth');
const groupCtrl = require('../controllers/group.controller');

const router = express.Router();

router.route('/')
  .get(auth.authenticate(), groupCtrl.getAll)
  .post(auth.authenticate(), groupCtrl.create);

router.route('/:id')
  .get(auth.authenticate(), groupCtrl.getOne);

module.exports = router;
