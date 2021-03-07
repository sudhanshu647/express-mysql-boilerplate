const { Model } = require('objection');
const moment = require('moment-timezone');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const { v4: uuidv4 } = require('uuid');
const APIError = require('../utils/APIError');
const { jwtSecret, jwtExpirationInterval } = require('../../config/vars');

class User extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'users';
  }

  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  $beforeInsert() {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10), null);
  }

  /**
   * Methods
   */
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'email', 'gender', 'profile_img', 'created_at'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }

  token() {
    const playload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this.id,
    };
    return jwt.encode(playload, jwtSecret);
  }

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  }

  /**
  * Return new validation error
  * if error is a email duplicate key error
  *
  * @param {Error} error
  * @returns {Error|APIError}
  */
  static checkDuplicateEmail(error) {
    if (error.name === 'UniqueViolationError' && error.constraint === 'users_email_unique') {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'email',
          location: 'body',
          messages: ['"email" already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  }

  /**
   * Find user by email and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  static async findAndGenerateToken(options) {
    const { email, password, refreshObject } = options;
    if (!email) throw new APIError({ message: 'An email is required to generate a token' });

    const user = await this.query().findOne({ email });
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (password) {
      if (user && (await user.passwordMatches(password))) {
        return { user, access_token: user.token() };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.user_email === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { user, access_token: user.token() };
      }
    } else {
      err.message = 'Incorrect email or refresh_token';
    }
    throw new APIError(err);
  }

  static async oAuthLogin({
    id, email, name, picture,
  }) {
    const user = await this.query().findOne('google_id', id).orWhere('email', email);

    if (user) {
      user.google_id = id;
      if (!user.name) user.name = name;
      if (!user.profile_img) user.profile_img = picture;
      await this.query().update(user).where('id', user.id);
      return user;
    }
    const password = uuidv4();
    return this.query().insert({
      google_id: id,
      email,
      password,
      name,
      profile_img: picture,
      email_verified_at: moment().format('YYYY-MM-DD HH:mm'),
    });
  }
}
module.exports = User;
