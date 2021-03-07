const { Joi } = require('express-validation');

module.exports = {
  // POST v1/signup/prelaunch
  update: {
    body: Joi.object({
      name: Joi.string().required(),
      date_of_birth: Joi.date().required(),
      gender: Joi.string().valid('male', 'female').required(),
    }),
  },
};
