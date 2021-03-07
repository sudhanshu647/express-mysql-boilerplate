const httpStatus = require('http-status');
const User = require('../models/User');
/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const user = {
    name: req.body.name,
    date_of_birth: req.body.date_of_birth,
    gender: req.body.gender,
  };
  User.query().update(user).where('id', req.user.id)
    .then(() => { res.status(httpStatus.OK); return res.json({ message: 'User details updated!', user }); })
    .catch((error) => next(error));
};

/**
 * Get user details by user ID
 * @public
 */
exports.getUserById = (req, res, next) => {
  User.query().findById(req.params.user_id)
    .select('name', 'gender', 'profile_img', 'gender')
    .then((user) => { res.status(httpStatus.OK); return res.json({ user }); })
    .catch((error) => next(error));
};

/**
 * Get all Users
 * @public
 */
exports.allUsers = (req, res, next) => {
  User.query().select('name', 'gender', 'profile_img', 'gender')
    .then((users) => { res.status(httpStatus.OK); return res.json({ users }); })
    .catch((error) => next(error));
};
