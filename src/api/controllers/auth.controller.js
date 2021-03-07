/* eslint-disable camelcase */
const httpStatus = require('http-status');
const moment = require('moment-timezone');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const PasswordResetToken = require('../models/PasswordResetToken');
const { jwtExpirationInterval, dashboardUrl } = require('../../config/vars');
const APIError = require('../utils/APIError');
const emailProvider = require('../services/emails/emailProvider');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, access_token) {
  const token_type = 'Bearer';
  const refresh_token = RefreshToken.generate(user).token;
  const expires_in = moment().add(jwtExpirationInterval, 'minutes');
  return {
    token_type,
    access_token,
    refresh_token,
    expires_in,
  };
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    // const userData = omit(req.body, 'role');
    const userData = {
      email: req.body.email,
      password: req.body.password,
      confirmation_code: crypto.randomBytes(40).toString('hex'),
    };
    const user = await User.query().insert(userData);
    emailProvider.verifyEmail(user);
    res.status(httpStatus.CREATED);
    return res.json({ message: 'User created!' });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const { user, access_token } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, access_token);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * login with an existing user or creates a new one if valid access_token token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
  try {
    const { user } = req;
    const access_token = user.token();
    const token = generateTokenResponse(user, access_token);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { email, refresh_token } = req.body;
    const refreshObject = await RefreshToken.query().findOne('user_email', email).where('token', refresh_token);
    if (!refreshObject) {
      throw new APIError({
        status: httpStatus.CONFLICT,
        message: 'Incorrect email or refresh_token',
      });
    }
    await RefreshToken.query().deleteById(refreshObject.id);
    const { user, access_token } = await User.findAndGenerateToken({ email, refreshObject });
    const response = generateTokenResponse(user, access_token);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

exports.sendPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.query().findOne({ email });

    if (user) {
      const passwordResetObj = await PasswordResetToken.generate(user);
      emailProvider.sendPasswordReset(passwordResetObj);
      res.status(httpStatus.OK);
      return res.json({ message: 'token send successfully' });
    }
    throw new APIError({
      status: httpStatus.UNAUTHORIZED,
      message: 'No account found with that email',
    });
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, password, reset_token } = req.body;
    const resetTokenObject = await PasswordResetToken.query().findOne({
      user_email: email,
      reset_token,
    });
    await PasswordResetToken.query().deleteById(resetTokenObject.id);

    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (!resetTokenObject) {
      err.message = 'Cannot find matching reset token';
      throw new APIError(err);
    }
    if (moment().isAfter(resetTokenObject.expires)) {
      err.message = 'Reset token is expired';
      throw new APIError(err);
    }

    const user = await User.query().findOne({ email: resetTokenObject.user_email });
    user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    await User.query().update(user).where('id', user.id);
    emailProvider.sendPasswordChangeEmail(user);

    res.status(httpStatus.OK);
    return res.json({ message: 'Password Updated!' });
  } catch (error) {
    return next(error);
  }
};

/**
 * Redirect user to login page if valid confirmation code
 * @public
 */
exports.verifyEmail = async (req, res, next) => {
  try {
    const { confirmation_code } = req.query;
    const user = await User.query().findOne('confirmation_code', confirmation_code);
    if (!user) {
      throw new APIError({
        status: httpStatus.UNAUTHORIZED,
        message: 'Invalid Confirmation code',
      });
    }
    await User.query().patch({ email_verified_at: moment().format('YYYY-MM-DD HH:mm') }).where('id', user.id);
    res.status(httpStatus.OK);
    return res.redirect(dashboardUrl);
  } catch (error) {
    return next(error);
  }
};
