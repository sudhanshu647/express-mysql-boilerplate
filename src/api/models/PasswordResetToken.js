/* eslint-disable camelcase */
const { Model } = require('objection');
const moment = require('moment-timezone');
const crypto = require('crypto');

class PasswordResetToken extends Model {
  static get tableName() {
    return 'password_reset_tokens';
  }

  /**
     * Generate a reset token object and saves it into the database
     *
     * @param {User} user
     * @returns {ResetToken}
     */
  static async generate(user) {
    const user_id = user.id;
    const user_email = user.email;
    const reset_token = `${user_id}.${crypto.randomBytes(40).toString('hex')}`;
    const expires = moment()
      .add(2, 'hours')
      .toDate();
    const ResetTokenObject = {
      reset_token,
      user_id,
      user_email,
      expires,
    };
    await this.query().insert(ResetTokenObject);
    return ResetTokenObject;
  }
}
module.exports = PasswordResetToken;
