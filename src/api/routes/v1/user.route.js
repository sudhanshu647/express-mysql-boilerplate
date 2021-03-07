const express = require('express');
const { validate } = require('express-validation');
const controller = require('../../controllers/user.controller');
const { authorize } = require('../../middlewares/auth');
const { update } = require('../../validations/user.validation');

const router = express.Router();

router
  .route('/')
  .get(authorize(), controller.loggedIn)
  .put(authorize(), validate(update), controller.update);

router
  .route('/all-users')
  .get(authorize(), controller.allUsers);

router
  .route('/:user_id')
  .get(authorize(), controller.getUserById);

module.exports = router;
