/* eslint-disable camelcase */
const { Model } = require('objection');
const moment = require('moment-timezone');
const crypto = require('crypto');

class RefreshToken extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'refresh_tokens';
  }

  /**
  * Generate a refresh token object and saves it into the database
  *
  * @param {User} user
  * @returns {RefreshToken}
  */
  static generate(user) {
    const tokenObject = {
      user_id: user.id,
      user_email: user.email,
      token: `${user.id}.${crypto.randomBytes(40).toString('hex')}`,
      expires: moment().add(30, 'days').toDate(),
    };
    RefreshToken.query().insert(tokenObject).catch((error) => {
      console.log('token save', error);
    });
    return tokenObject;
  }
}
module.exports = RefreshToken;
