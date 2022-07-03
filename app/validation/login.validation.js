const Joi = require('joi');
class LoginValidation {

  validateUserLogin(user) {
    const schema = {
      melliCode: Joi.string()
        .regex(/^\d{10}$/)
        .required(),
      password: Joi.string()
        .required()
        .min(5)
        .max(32)
    };
    return Joi.validate(user, schema, { abortEarly: false });
  };
}
module.exports = LoginValidation;